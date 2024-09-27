const BaseException = require('../exceptions/BaseException');
const Tag = require('../model/TagModel');
const MySqlRepository = require('../repository/MySqlRepository');

class TagService {
    constructor() {
        console.time('TagService setup');
        this.mysqlRepository = new MySqlRepository();
        console.timeLog('TagService setup', 'MySqlRepository setup complete');
        console.timeEnd('TagService setup');
    }

    async getTags(limit, offset) {
        try {
            return await this.mysqlRepository.getTags(limit, offset);
        } catch (error) {
            throw new BaseException(`getTagsService: ${error.message}`, 400, "Bad Request", "GetTagsError");
        }
    }
}

module.exports = TagService;