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
            const { title, description, tags } = req.body;
            const id = await this.publicationService.createPublication(title, description, tags);
            console.timeLog(label, "publication created successfully");
            console.timeEnd(label);
            return res
                .status(201)
                .send({
                    message: "Publication created successfully",
                    id: id
                 });
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(
                `PublicationController.create: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "PublicationCreationError"
            );
        }
    }
}

module.exports = PublicationController;
