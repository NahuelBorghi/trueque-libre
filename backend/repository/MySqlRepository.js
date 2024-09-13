const BaseException = require('../exceptions/BaseException');
const User = require('../model/UserModel');
const { createConnection } = require("mysql2/promise");
const { hashFunciton } = require('../utils/hash');


class MySqlRepository {
    constructor() {
        this.setup();
    }

    async setup() {
        console.time('MySqlRepository setup');
        const env = {
            host: process.env.DATABASE_HOST || "FALTA VARIABLE DE ENTORNO DATABASE_HOST",
            user: process.env.DATABASE_USER || "FALTA VARIABLE DE ENTORNO DATABASE_USER",
            password: process.env.DATABASE_PASSWORD || "FALTA VARIABLE DE ENTORNO MYSQL_PASSWORD",
            database: process.env.MYSQL_DATABASE || "FALTA VARIABLE DE ENTORNO MYSQL_DATABASE",
        };
        try {
            this.connection = await createConnection(env);
            console.timeLog('MySqlRepository setup', 'MySqlConnection setup complete');
            console.timeEnd('MySqlRepository setup');
        } catch (error) {
            console.error(error);
            console.timeEnd('MySqlRepository setup');
        }
    }
    
    // User methods
    async createUser(userName, password, email) {
        const { hash, salt } = hashFunciton(password);
        const newUser = new User(userName, hash, salt, email);
        const query = `INSERT INTO Users (id, userName, password, salt, email, state) VALUES (?, ?, ?, ?, ?, ?)`;
        try {
            const [result] = await this.connection.execute(query, [newUser.id, newUser.userName, newUser.password, newUser.salt, newUser.email, newUser.state]);
            return result.affectedRows;
        }catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.createUser: ${error.message}`, 400, "Bad Request", "UserCreationError");
        }
    }
    
    async getUserById(id) {
        const query = `SELECT * FROM Users WHERE id = ?`;
        try {
            const [[result]] = await this.connection.execute(query, [id]);
            const user = new User(result.userName, result.password, result.salt, result.email, result.state, result.id);
            return user;
        }catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.getUserById: ${error.message}`, 400, "Bad Request", "UserCreationError");
        }
    }

    async getUserLoggedById(id) {
        const query = `SELECT * FROM Users WHERE id = ? AND state = 1`;
        try {
            const [[result]] = await this.connection.execute(query, [id]);
            if(result){
                const user = new User(result.userName, result.password, result.salt, result.email, result.state, result.id);
                return user;
            }
        }catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.getUserLoggedById: ${error.message}`, 400, "Bad Request", "UserCreationError");
        }
    }

    async getUserByUserName(userName) {
        const query = `SELECT * FROM Users WHERE userName = ?`;
        try {
            const [[result]] = await this.connection.execute(query, [userName]);
            const user = new User(result.userName, result.password, result.salt, result.email, result.setup, result.id);
            return user;
        }catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.getUserByUserName: ${error.message}`, 400, "Bad Request", "UserCreationError");
        }
    }

    async updateUserState(id, state) {
        const query = `UPDATE Users SET state = ? WHERE id = ?`;
        try{
            await this.connection.execute(query, [state, id])
            const user = await this.getUserLoggedById(id);
            return user
        }catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.updateUserState: ${error.message}`, 400, "Bad Request", "UserCreationError");
        }
    }

    // Publication methods
    async createPublication(publication) {
        const query = `INSERT INTO Publication (id, title, description, status, creationDate, creationUser, modificationDate, modificationUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        try {
            const [result] = await this.connection.execute(query,
                [
                    publication.id,
                    publication.title,
                    publication.description,
                    publication.status,
                    publication.creationDate,
                    publication.creationUser,
                    publication.modificationDate,
                    publication.modificationUser
                ]
            );
            return result.insertId;
        }catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.createPublication: ${error.message}`, 400, "Bad Request", "PublicationCreationError");
        }
    }

    // Chat methods


    // Offer methods


    // Image methods
    async insertImage ({ id, imageName, imageRoute, mimetype, creationDate, creationUser }){
        const query = ` INSERT INTO Image (id, imageName, imageRoute, mimetype, creationDate, creationUser) VALUES (?, ?, ?, ?, ?, ?); `;
        const validationQuery = `SELECT id FROM Users WHERE id = ?`;
        try {
            const [validation] = await this.connection.execute(validationQuery, [creationUser]);
            if (validation.length === 0) {
                throw new BaseException("User not found", 404, "Not Found", "UserNotFound");
            }
            console.log({id, imageName, imageRoute, mimetype, creationDate, creationUser})
            await this.connection.execute(query, [id, imageName, imageRoute, mimetype, creationDate, creationUser]);
        } catch (error) {
            console.error(error);
            throw new BaseException(`mysqlRepository.insertImage: ${error.message}`, 400, "Bad Request", "ImageCreationError");
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
            throw new BaseException(`mysqlRepository.getImageById: ${error.message}`, 400, "Bad Request", "ImageRetrievalError");
        }
    }
    
}

module.exports = MySqlRepository;