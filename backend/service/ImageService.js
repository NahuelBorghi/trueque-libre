const MysqlRepository = require("../repository/MySqlRepository.js");
const Image = require("../model/ImageModel.js");
const zlib = require('zlib');
const fs = require("fs");
const BaseException = require("../exceptions/BaseException.js");

class ImageService {
    constructor() {
        console.time("ImageService setup");
        this.mysqlRepository = new MysqlRepository();
        console.timeLog("ImageService setup", "ImageService setup complete");
        console.timeEnd("ImageService setup");
    }

    async saveImage(fileBuffer, name, mimetype, creationUser) {
        try {
            const imageDirectory = `${__dirname}/../images/${creationUser}`
            const image = new Image(name, mimetype, creationUser);

            zlib.gzip(fileBuffer, (err, buffer) => {
                if (err) {
                    console.error(err);
                } else {
                    fileBuffer = buffer;
                }
            });

            await this.mysqlRepository.insertImage(image);

            if(!fs.existsSync(imageDirectory)){
                fs.mkdirSync(imageDirectory, { recursive: true })
            }
            if(fs.existsSync(imageDirectory + "/" + image.image + "." + mimetype.split("/")[1])){
                throw new BaseException("Image exists", 400, "Try another", "Image exists")
            }
            console.error(imageDirectory + "/" + image.image + "." + mimetype.split("/")[1])
            fs.writeFileSync(imageDirectory + "/" + image.image + "." + mimetype.split("/")[1], fileBuffer);
            return image.id;
        } catch (error) {
            console.error(error);
            throw new BaseException("ImageService.saveImage: " + error.message, error.statusCode ?? 400, "Error saving image", "ImageUploadError");
        }
    }

    // async saveImage(fileBuffer, mimetype, creationUser) {
    //     try {
    //         const image = new Image(fileBuffer, mimetype, creationUser);
    //         console.log(fileBuffer.length);
    //         zlib.gzip(image.image, (err, buffer) => {
    //             if (err) {
    //                 console.error(err);
    //             } else {
    //                 console.log(buffer.length);
    //                 image.image = buffer;
    //             }
    //         });
    //         await this.mysqlRepository.insertImage(image);
    //         return image.id;
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    async getImageById(imageId) {
        try {
            const result = await this.mysqlRepository.getImageById(imageId);
            if (result == null) {
                return null;
            }
            const image = new Image(result.image, result.mimetype, result.creationUser, result.id, result.creationDate);
            const imageRoute = `${__dirname}/../images/${result.creationUser}/${image.image}.${image.mimetype.split("/")[1]}`
            console.log(imageRoute)
            if(!fs.existsSync(imageRoute)){
                throw new BaseException("Image doesn't exists", 400, "Probablly been deleted", "Image doesn't exist")
            }
            const imageCoppied = fs.readFileSync(imageRoute)
            zlib.gzip(imageCoppied, (err, buffer) => {
                if (err) {
                    console.error(err);
                } else {
                    imageCoppied = buffer;
                }
            });
            return {...image, image: imageCoppied};
        } catch (error) {
            console.error(error);
        }
    }

    saveRelation(idPublication, idUser, idImage) {
        try {
            return this.mysqlRepository.insertImagePublicationRelation(idPublication, idUser, idImage);
        } catch (error) {
            console.error(error);
        }
    }

    // async getImageById(imageId) {
    //     try {
    //         const result = await this.mysqlRepository.getImageById(imageId);
    //         if (result == null) {
    //             return null;
    //         }
    //         const image = new Image(result.image, result.mimetype, result.creationUser, result.id);
    //         zlib.gunzip(image.image, (err, buffer) => {
    //             if (err) {
    //                 console.error(err);
    //             } else {
    //                 image.image = buffer;
    //             }
    //         });
    //         return image;
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
}

module.exports = ImageService;
