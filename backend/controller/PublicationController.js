const BaseException = require("../exceptions/BaseException");
const PublicationService = require("../service/PublicationService");

class PublicationController {
    constructor() {
        const label = `-------------------- PublicationController setup - ${Date.now()}`;
        console.time(label);
        this.publicationService = new PublicationService();
        console.timeLog(label, "PublicationService setup complete");
        console.timeEnd(label);
    }
    async create(req, res) {
        const label = `-------------------- Publication creation - ${Date.now()}`;
        console.time(label);
        try {
            const creationUser = req.user.id;
            const { title, description, ubication} = req.body;
            if (!title || !description || !ubication || !creationUser) {
                console.timeEnd(label);
                throw new BaseException(
                    "PublicationController.create: Missing required fields (title, description, ubication, creationUser)",
                    400,
                    "Bad Request",
                    "MissingFields"
                );
            }
            const id = await this.publicationService.createPublication( title, description, ubication, creationUser );
            console.timeLog(label, "publication created successfully");
            console.timeEnd(label);
            return res .status(201) .send({ message: "Publication created successfully", id: id });
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(
                `PublicationController.create: ${error.message}`,
                error.statusCode ?? 400,
                error.stack ?? "Bad Request",
                error.codeMessageLanguage ?? "CreatePublicationError"
            );
        }
    }

    async get(req, res) {
        const label = `-------------------- Publication get - ${Date.now()}`;
        console.time(label);
        try {
            let { limit, offset } = req.query;
            limit = limit ? parseInt(limit) : 10;
            offset = offset ? parseInt(offset)*limit : 0;
            const publications = await this.publicationService.getPublications(limit, offset);
            console.timeLog(label, "publications retrieved successfully");
            console.timeEnd(label);
            return res.status(200).send(publications);
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(
                `PublicationController.get: ${error.message}`,
                error.statusCode ?? 400,
                error.stack ?? "Bad Request",
                error.codeMessageLanguage ?? "GetPublicationsError"
            );
        }
    }

    async getById(req, res) {
        const label = `-------------------- Publication getById - ${Date.now()}`;
        console.time(label);
        try {
            const { id } = req.params;
            if (!id) {
                console.timeEnd(label);
                throw new BaseException("PublicationController.getById: Missing required field (id)", 400, "Bad Request", "MissingFields");
            }
            const publication = await this.publicationService.getPublicationById(id);
            console.timeLog(label, "publication retrieved successfully");
            console.timeEnd(label);
            return res.status(200).send(publication);
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(
                `PublicationController.getById: ${error.message}`,
                error.statusCode ?? 400,
                error.stack ?? "Bad Request",
                error.codeMessageLanguage ?? "GetPublicationError"
            );
        }
    }

    async getByUserId(req, res) {
        const label = `-------------------- Publication getByUserId - ${Date.now()}`;
        console.time(label);
        try {
            const { idUser } = req.params;
            if (!idUser) {
                console.timeEnd(label);
                throw new BaseException("PublicationController.getByUserId: Missing required field (idUser)", 400, "Bad Request", "MissingFields");
            }
            const publications = await this.publicationService.getPublicationsByUserId(idUser);
            console.timeLog(label, "publications retrieved successfully");
            console.timeEnd(label);
            return res.status(200).send(publications);
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(
                `PublicationController.getByUserId: ${error.message}`,
                error.statusCode ?? 400,
                error.stack ?? "Bad Request",
                error.codeMessageLanguage ?? "GetPublicationsError"
            );
        }
    }

    async updateState(req, res) {
        const label = `-------------------- Publication updateState - ${Date.now()}`;
        console.time(label);
        try {
            const modificationUser = req.user.id;
            const { id, title, description, state, status } = req.body;
            if (!id || !title || !description || !state || !status || !modificationUser) {
                console.timeEnd(label);
                throw new BaseException( "PublicationController.updateState: Missing required fields (id, title, description, state, status, modificationUser ", 400, "Bad Request", "MissingFields" );
            }
            const publication = { id, title, description, state, status, modificationUser };
            const result = await this.publicationService.updatePublicationState(publication);
            console.timeLog(label, "publication state updated successfully");
            console.timeEnd(label);
            return res.status(200).send({ message: "Publication state updated successfully", result: result });
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(
                `PublicationController.updateState: ${error.message}`,
                error.statusCode ?? 400,
                error.stack ?? "Bad Request",
                error.codeMessageLanguage ?? "UpdatePublicationError"
            );
        }
    }
}

module.exports = PublicationController;
