const MysqlRepository = require("../repository/MySqlRepository.js");
const Image = require("../model/ImageModel.js");
const zlib = require('zlib');

class ImageService {
    constructor() {
        console.time("ImageService setup");
        this.mysqlRepository = new MysqlRepository();
        console.timeLog("ImageService setup", "ImageService setup complete");
        console.timeEnd("ImageService setup");
    }

    async saveImage(fileBuffer, mimetype, creationUser) {
        try {
            const image = new Image(fileBuffer, mimetype, creationUser);
            console.log(fileBuffer.length);
            zlib.gzip(image.image, (err, buffer) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(buffer.length);
                    image.image = buffer;
                }
            });
            await this.mysqlRepository.insertImage(image);
            return image.id;
        } catch (error) {
            console.error(error);
        }
    }

    async getImageById(imageId) {
        try {
            const result = await this.mysqlRepository.getImageById(imageId);
            if (result == null) {
                return null;
            }
            const image = new Image(result.image, result.mimetype, result.creationUser, result.id);
            zlib.gunzip(image.image, (err, buffer) => {
                if (err) {
                    console.error(err);
                } else {
                    image.image = buffer;
                }
            });
            return image;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = ImageService;
