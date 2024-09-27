const BaseException = require("../exceptions/BaseException");
const TagService = require("../service/TagService.js");

class TagController {
    constructor() {
        const label = `-------------------- TagController setup - ${Date.now()}`;
        console.time(label);
        this.tagService = new TagService();
        console.timeLog(label, "TagService setup complete");
        console.timeEnd(label);
    }
    async get(req, res) {
        const label = `-------------------- Tag get - ${Date.now()}`;
        console.time(label);
        try {
            const { limit, offset } = req.query;
            const tags = await this.tagService.getTags(limit, offset);
            console.timeLog(label, "tags retrieved successfully");
            console.timeEnd(label);
            return res.status(200).send(tags);
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(
                `TagController.get: ${error.message}`,
                error.statusCode ?? 400,
                error.stack ?? "Bad Request",
                error.codeMessageLanguage ?? "GetTagsError"
            );
        }
    }
}

module.exports = TagController;