const BaseException = require('../exceptions/BaseException');
const User = require('../model/UserModel');
const { createConnection } = require("mysql2/promise");
const { hashFunciton } = require('../utils/hash');


class MySqlRepository {
    constructor() {
        this.setup();
    }

    async setup() {
        const label = `-------------------- MySqlRepository setup - ${Date.now()}`;
        console.time(label);
        const env = {
            host: process.env.DATABASE_HOST || "FALTA VARIABLE DE ENTORNO DATABASE_HOST",
            user: process.env.DATABASE_USER || "FALTA VARIABLE DE ENTORNO DATABASE_USER",
            password: process.env.DATABASE_PASSWORD || "FALTA VARIABLE DE ENTORNO MYSQL_PASSWORD",
            database: process.env.MYSQL_DATABASE || "FALTA VARIABLE DE ENTORNO MYSQL_DATABASE",
        };
        try {
            this.connection = await createConnection(env);
            console.timeLog(label, 'MySqlConnection setup complete');
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
            const [result] = await this.connection.execute(query, [newUser.id, newUser.userName, newUser.password, newUser.email, newUser.state]);
            return result.affectedRows;
        } catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.createUser: ${error.message}`, error.statusCode ?? 400, "Bad Request", "UserCreationError");
        }
    }
    
    async getUserById(id) {
        const query = `SELECT * FROM Users WHERE id = ?`;
        try {
            const [[result]] = await this.connection.execute(query, [id]);
            const user = new User(result.userName, result.password, result.email, result.state, result.id);
            return user;
        } catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.getUserById: ${error.message}`, error.statusCode ?? 400, "Bad Request", "UserCreationError");
        }
    }

    async getUserLoggedById(id) {
        const query = `SELECT * FROM Users WHERE id = ? AND state = 1`;
        try {
            const [[result]] = await this.connection.execute(query, [id]);
            if (result) {
                const user = new User(result.userName, result.password, result.email, result.state, result.id);
                return user;
            }
        } catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.getUserLoggedById: ${error.message}`, error.statusCode ?? 400, "Bad Request", "UserCreationError");
        }
    }

    async getUserByUserName(userName) {
        const query = `SELECT * FROM Users WHERE userName = ?`;
        try {
            const [[result]] = await this.connection.execute(query, [userName]);
            if (!result) {
                throw new BaseException('User not found', 404, "Not Found", "UserNotFoundError");
            }
            const user = new User(result.userName, result.password, result.email, result.setup, result.id);
            return user;
        } catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.getUserByUserName: ${error.message}`, error.statusCode ?? 400, "Bad Request", "UserCreationError");
        }
    }

    async updateUserState(id, state) {
        const query = `UPDATE Users SET state = ? WHERE id = ?`;
        try {
            await this.connection.execute(query, [state, id])
            const user = await this.getUserLoggedById(id);
            return user
        } catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.updateUserState: ${error.message}`, error.statusCode ?? 400, "Bad Request", "UserCreationError");
        }
    }

    // Publication methods
    async createPublication(publication) {
        const query = `INSERT INTO Publication (id, idUser, title, description, state, status, creationDate, creationUser, modificationDate, modificationUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        try {
            const [result] = await this.connection.execute(query,
                [
                    publication.id,
                    publication.title,
                    publication.description,
                    publication.state,
                    publication.status,
                    publication.creationDate,
                    publication.creationUser,
                    publication.modificationDate,
                    publication.modificationUser
                ]
            );
            return result.insertId;
        } catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.createPublication: ${error.message}`, error.statusCode ?? 400, "Bad Request", "PublicationCreationError");
        }
    }

    async getPublications(limit, offset) {
        const query = `SELECT *, COUNT(*) OVER() as total FROM Publication LIMIT ? OFFSET ?`;
        try {
            const [result] = await this.connection.execute(query, [limit, offset]);
            return result;
        } catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.getPublications: ${error.message}`, error.statusCode ?? 400, "Bad Request", "GetPublicationsError");
        }
    }

    async getPublicationById(id) {
        const query = `SELECT * FROM Publication WHERE id = ?`;
        try {
            const [[result]] = await this.connection.execute(query, [id]);
            return result;
        } catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.getPublicationById: ${error.message}`, error.statusCode ?? 400, "Bad Request", "GetPublicationError");
        }
    }

    async getPublicationsByUserId(idUser) {
        const query = `SELECT * FROM Publication WHERE idUser = ?`;
        try {
            const [result] = await this.connection.execute(query, [idUser]);
            return result;
        } catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.getPublicationsByUserId: ${error.message}`, error.statusCode ?? 400, "Bad Request", "GetPublicationsError");
        }
    }

    async updatePublicationState(publication) {
        const query = "UPDATE Publication SET title = ?, description = ?, state = ?, status = ?, modificationDate = ?, modificationUser = ? WHERE id = ?";
        try {
            const [result] = await this.connection.execute(query,
                [
                    publication.title,
                    publication.description,
                    publication.state,
                    publication.status,
                    publication.modificationDate,
                    publication.modificationUser,
                    publication.id
                ]
            );
            return result.insertId;
        } catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.updatePublicationState: ${error.message}`, error.statusCode ?? 400, "Bad Request", "UpdatePublicationState");
        }
    }

    async deletePublication(id) {
        const query = `DELETE FROM Publication WHERE id = ?`;
        try {
            const [result] = await this.connection.execute(query, [id]);
            return result.affectedRows;
        } catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.deletePublication: ${error.message}`, error.statusCode ?? 400, "Bad Request", "DeletePublicationError");
        }
    }

    // Chat methods


    // Offer methods


    // Image methods
    async insertImage({ id, imageName, imageRoute, mimetype, creationDate, creationUser }) {
        const query = ` INSERT INTO Image (id, imageName, imageRoute, mimetype, creationDate, creationUser) VALUES (?, ?, ?, ?, ?, ?); `;
        const validationQuery = `SELECT id FROM Users WHERE id = ?`;
        try {
            const [validation] = await this.connection.execute(validationQuery, [creationUser]);
            if (validation.length === 0) {
                throw new BaseException("User not found", 404, "Not Found", "UserNotFound");
            }
            console.log({ id, imageName, imageRoute, mimetype, creationDate, creationUser })
            await this.connection.execute(query, [id, imageName, imageRoute, mimetype, creationDate, creationUser]);
        } catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.insertImage: ${error.message}`, error.statusCode ?? 400, "Bad Request", "ImageCreationError");
        }
    };

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
            throw new BaseException(`mysqlRepository.getImageById: ${error.message}`, error.statusCode ?? 400, "Bad Request", "ImageRetrievalError");
        }
    }

    // Tag methods
    async getTags(limit, offset) {
        const query = `SELECT *, COUNT(*) OVER() as total FROM Tags LIMIT ? OFFSET ?`;
        try {
            const [result] = await this.connection.execute(query, [limit, offset]);
            return result;
        } catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.getTags: ${error.message}`, error.statusCode ?? 400, "Bad Request", "GetTagsError");
        }
    
    }
}

module.exports = MySqlRepository;