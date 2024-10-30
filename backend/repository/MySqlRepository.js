const BaseException = require('../exceptions/BaseException');
const User = require('../model/UserModel');
const { createConnection } = require("mysql2/promise");
const { hashFunciton } = require('../utils/hash');
const generateUUID = require('../utils/UUID');


class MySqlRepository {
    constructor() {
        this.setup();
    }

    async setup() {
        const label = `-------------------- MySqlRepository setup - ${Date.now()}`;
        console.time(label);
        const env = {
            host:
                process.env.DATABASE_HOST ||
                "FALTA VARIABLE DE ENTORNO DATABASE_HOST",
            user:
                process.env.DATABASE_USER ||
                "FALTA VARIABLE DE ENTORNO DATABASE_USER",
            password:
                process.env.DATABASE_PASSWORD ||
                "FALTA VARIABLE DE ENTORNO MYSQL_PASSWORD",
            database:
                process.env.MYSQL_DATABASE ||
                "FALTA VARIABLE DE ENTORNO MYSQL_DATABASE",
        };
        try {
            this.connection = await createConnection(env);
            console.timeLog(label, "MySqlConnection setup complete");
        } catch (error) {
            console.error(error);
        }
        console.timeEnd(label);
    }

    // User methods
    async createUser(userName, password, email) {
        const { hash, salt } = hashFunciton(password);
        const newUser = new User(userName, hash, email);
        const query = `INSERT INTO Users (id, userName, password, email, state) VALUES (?, ?, ?, ?, ?)`;
        try {
            const [result] = await this.connection.execute(query, [
                newUser.id,
                newUser.userName,
                newUser.password,
                newUser.email,
                newUser.state,
            ]);
            return result.affectedRows;
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.createUser: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "UserCreationError"
            );
        }
    }

    async getUserById(id) {
        const query = `SELECT * FROM Users WHERE id = ?`;
        try {
            const [[result]] = await this.connection.execute(query, [id]);
            if (!result) throw new BaseException( "User not found", 404, "Not Found", "UserNotFoundError" );
            const user = new User(
                result.userName,
                result.password,
                result.email,
                result.state,
                result.id
            );
            return user;
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.getUserById: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "UserCreationError"
            );
        }
    }

    async getUserLoggedById(id) {
        const query = `SELECT * FROM Users WHERE id = ? AND state = 1`;
        try {
            const [[result]] = await this.connection.execute(query, [id]);
            if (result) {
                const user = new User(
                    result.userName,
                    result.password,
                    result.email,
                    result.state,
                    result.id
                );
                return user;
            }
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.getUserLoggedById: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "UserCreationError"
            );
        }
    }

    async getUserByUserName(userName) {
        const query = `SELECT * FROM Users WHERE userName = ?`;
        try {
            const [[result]] = await this.connection.execute(query, [userName]);
            if (!result) {
                throw new BaseException(
                    "User not found",
                    404,
                    "Not Found",
                    "UserNotFoundError"
                );
            }
            const user = new User(
                result.userName,
                result.password,
                result.email,
                result.setup,
                result.id
            );
            return user;
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.getUserByUserName: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "UserCreationError"
            );
        }
    }

    async updateUserState(id, state) {
        const query = `UPDATE Users SET state = ? WHERE id = ?`;
        try {
            await this.connection.execute(query, [state, id]);
            const user = await this.getUserLoggedById(id);
            return user;
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.updateUserState: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "UserCreationError"
            );
        }
    }

    // Publication methods
    async createPublication(publication) {
        const query = `INSERT INTO Publications (id, title, description, state, status, ubication, exchange, creationDate, creationUser, modificationDate, modificationUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        try {
            await this.connection.execute(query, [
                publication.id,
                publication.title,
                publication.description,
                publication.state,
                publication.status,
                publication.ubication,
                publication.exchange,
                publication.creationDate,
                publication.creationUser,
                publication.modificationDate,
                publication.modificationUser,
            ]);
            return publication.id;
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.createPublication: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "PublicationCreationError"
            );
        }
    }

    async getPublications(limit, offset, tagsFilter) {
        const queryData = `
        SELECT 
            Publications.*, 
            (
                SELECT JSON_ARRAYAGG(JSON_OBJECT('id', Tags.id, 'tagName', Tags.tagName))
                FROM TagPublication
                INNER JOIN Tags ON TagPublication.idTags = Tags.id
                WHERE TagPublication.Publications_id = Publications.id
            ) AS publicationTags,
            (
                SELECT JSON_ARRAYAGG(i.idImage)
                FROM ImagePublication i
                WHERE i.idPublication = Publications.id
            ) AS images
        FROM Publications
        ${
            tagsFilter.length !== 0
                ? `
            INNER JOIN TagPublication tp ON Publications.id = tp.Publications_id
            INNER JOIN Tags t ON tp.idTags = t.id
            WHERE t.tagName IN (${tagsFilter.map(() => "?").join(",")})
        `
                : ""
        }
        GROUP BY Publications.id
        LIMIT ? OFFSET ?`;

        const queryTotal = `
        SELECT COUNT(DISTINCT Publications.id) as total 
        FROM Publications
        INNER JOIN TagPublication ON Publications.id = TagPublication.Publications_id
        INNER JOIN Tags ON TagPublication.idTags = Tags.id
        ${
            tagsFilter.length !== 0
                ? `WHERE Tags.tagName IN (${tagsFilter
                      .map(() => "?")
                      .join(",")})`
                : ""
        }
    `;

        try {
            // Ejecuta ambas consultas en paralelo
            const [dataResult, totalResult] = await Promise.all([
                this.connection.execute(queryData, [
                    ...tagsFilter,
                    limit,
                    offset,
                ]),
                this.connection.execute(queryTotal, [...tagsFilter]),
            ]);

            const data = dataResult[0];
            const total = totalResult[0][0]["total"];

            return { data, total };
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.getPublications: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "GetPublicationsError"
            );
        }
    }

    async getPublicationById(id) {
        const query = `
            SELECT 
                p.*, 
                t.id AS tagId, 
                t.tagName, 
                i.idImage 
            FROM 
                Publications p
            LEFT JOIN 
                TagPublication tp ON p.id = tp.Publications_id
            LEFT JOIN 
                Tags t ON tp.idTags = t.id
            LEFT JOIN 
                ImagePublication i ON p.id = i.idPublication
            WHERE 
                p.id = ?;
        `;
        try {
            const [results] = await this.connection.execute(query, [id]);

            // Organiza los resultados para evitar duplicados
            const publication = {
                ...results[0],
                tags: [],
                images: [],
            };

            // Agrega los tags e imágenes al objeto `publication`
            results.forEach((row) => {
                if (
                    row.tagId &&
                    !publication.tags.some((tag) => tag.id === row.tagId)
                ) {
                    publication.tags.push({
                        id: row.tagId,
                        tagName: row.tagName,
                    });
                }
                if (row.idImage && !publication.images.includes(row.idImage)) {
                    publication.images.push(row.idImage);
                }
            });

            return publication;
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.getPublicationById: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "GetPublicationError"
            );
        }
    }

    async getPublicationsByUserId(idUser) {
        const query = `SELECT * FROM Publication WHERE idUser = ?`;
        try {
            const [result] = await this.connection.execute(query, [idUser]);
            return result;
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.getPublicationsByUserId: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "GetPublicationsError"
            );
        }
    }

    async updatePublicationState(publication) {
        const query =
            "UPDATE Publication SET title = ?, description = ?, state = ?, status = ?, modificationDate = ?, modificationUser = ? WHERE id = ?";
        try {
            const [result] = await this.connection.execute(query, [
                publication.title,
                publication.description,
                publication.state,
                publication.status,
                publication.modificationDate,
                publication.modificationUser,
                publication.id,
            ]);
            return result.insertId;
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.updatePublicationState: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "UpdatePublicationState"
            );
        }
    }

    async deletePublication(id) {
        const query = `DELETE FROM Publication WHERE id = ?`;
        try {
            const [result] = await this.connection.execute(query, [id]);
            return result.affectedRows;
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.deletePublication: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "DeletePublicationError"
            );
        }
    }

    // Chat methods

    // Offer methods

    // Image methods
    async insertImage({ id, image, mimetype, creationDate, creationUser }) {
        const query = ` INSERT INTO Image (id, image, mimetype, creationDate, creationUser) VALUES (?, ?, ?, ?, ?); `;
        const validationQuery = `SELECT id FROM Users WHERE id = ?`;
        try {
            const [validation] = await this.connection.execute(
                validationQuery,
                [creationUser]
            );
            if (validation.length === 0) {
                throw new BaseException(
                    "User not found",
                    404,
                    "Not Found",
                    "UserNotFound"
                );
            }
            await this.connection.execute(query, [
                id,
                image,
                mimetype,
                creationDate,
                creationUser,
            ]);
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.insertImage: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "ImageCreationError"
            );
        }
    }

    async getImageById(imageId) {
        const query = `SELECT * FROM Image WHERE id = ?`;
        try {
            const [rows] = await this.connection.execute(query, [imageId]);
            if (rows.length === 0) {
                return null;
            }
            return rows[0];
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.getImageById: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "ImageRetrievalError"
            );
        }
    }

    async insertImagePublicationRelation(idPublication, idUser, idImage) {
        const query = `INSERT INTO ImagePublication (id, idPublication, idUser, idImage) VALUES (?, ?, ?, ?)`;
        const id = generateUUID();
        console.log({ id, idPublication, idUser, idImage });
        const values = [id, idPublication, idUser, idImage];
        try {
            await this.connection.execute(query, values);
            return id;
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.insertImagePublicationRelation: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "ImagePublicationRelationError"
            );
        }
    }

    // Tag methods
    async getTags(limit, offset) {
        const queryData = `SELECT * FROM Tags LIMIT ? OFFSET ?`;
        const queryTotal = `SELECT COUNT(*) as total FROM Tags`;
        try {
            // promise.all para ejecutar las dos consultas en paralelo ;)
            const res = Promise.all([
                this.connection.execute(queryData, [limit, offset]),
                this.connection.execute(queryTotal),
            ]);
            const [data, total] = await res;
            return { data: data[0], total: total[0] };
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.getTags: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "GetTagsError"
            );
        }
    }

    async addTagToPublication(idPublication, idTag) {
        const query = `INSERT INTO TagPublication (Publications_id, idTags) VALUES (?, ?)`;
        try {
            await this.connection.execute(query, [idPublication, idTag]);
        } catch (error) {
            console.error(error);
            throw new BaseException(
                `mysqlRepository.asociateTagToPublication: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "AsociateTagToPublicationError"
            );
        }
    }
}

module.exports = MySqlRepository;