const BaseException = require('../exceptions/BaseException');
const Publication = require('../model/PublicationModel');
const MySqlRepository = require('../repository/MySqlRepository');

class PublicationService {
    constructor() {
        console.time('PublicationService setup');
        this.mysqlRepository = new MySqlRepository();
        console.timeLog('PublicationService setup', 'MySqlRepository setup complete');
        console.timeEnd('PublicationService setup');
    }

    async createPublication( title, description, ubication, creationUser ) {
        try {
            const publication = new Publication( title, description, ubication, creationUser );
            return await this.mysqlRepository.createPublication(publication);
        } catch (error) {
            throw new BaseException(`createPublicationService: ${error.message}`, 400, "Bad Request", "PublicationCreationError");
        }
    }

    async getPublicationById(id) {
        try {
            return await this.mysqlRepository.getPublicationById(id);
        } catch (error) {
            throw new BaseException(`getPublicationByIdService: ${error.message}`, 400, "Bad Request", "GetPublicationError");
        }
    }

    async getPublications(limit, offset) {
        try {
            return await this.mysqlRepository.getPublications(limit, offset);
        } catch (error) {
            throw new BaseException(`getPublicationsService: ${error.message}`, 400, "Bad Request", "GetPublicationsError");
        }
    }

    async getPublicationsByUserId(idUser) {
        try {
            return await this.mysqlRepository.getPublicationsByUserId(idUser);
        } catch (error) {
            throw new BaseException(`getPublicationsByUserIdService: ${error.message}`, 400, "Bad Request", "GetPublicationsError");
        }
    }

    async updatePublicationState(publication) {
        try {
            return await this.mysqlRepository.updatePublicationState(publication);
        } catch (error) {
            throw new BaseException(`updatePublicationStateService: ${error.message}`, 400, "Bad Request", "UpdatePublicationError");
        }
    }

    async deletePublication(id) {
        try {
            return await this.mysqlRepository.deletePublication(id);
        } catch (error) {
            throw new BaseException(`deletePublicationService: ${error.message}`, 400, "Bad Request", "DeletePublicationError");
        }
    }
}

module.exports = PublicationService;