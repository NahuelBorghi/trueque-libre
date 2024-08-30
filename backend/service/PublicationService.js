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

    async createPublication(title, description, tags) {
        try {
            const publication = new Publication(title, description, tags);
            return await this.mysqlRepository.createPublication(publication);
        } catch (error) {
            throw new BaseException(`createPublicationService: ${error.message}`, 400, "Bad Request", "PublicationCreationError");
        }
    }
}

module.exports = PublicationService;