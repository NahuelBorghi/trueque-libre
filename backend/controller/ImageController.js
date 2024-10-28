const BaseException = require("../exceptions/BaseException.js");
const ImageService = require("../service/ImageService.js");
const multer = require('multer');
const { hashFunciton } = require("../utils/hash.js");

class ImageController {
    constructor() {
        const label = `-------------------- ImageController setup - ${Date.now()}`;
        console.time(label);
        this.imageService = new ImageService();
        console.timeLog(label, 'ImageService setup complete');
        console.timeEnd(label);
    }

    async uploadImage(req, res) {
        try {
            // Usar multer para manejar la carga de archivos
            const upload = multer({
                storage: multer.memoryStorage(),
                fileFilter: (req, file, cb) => {
                    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
                    if (allowedMimes.includes(file.mimetype)) {
                        cb(null, true);
                    } else {
                        cb(new BaseException("Invalid file type", 400, "Bad Request", "InvalidFileType"));
                    }
                }
            })
            upload.single('file')(req, res, async (err) => {
                if (err) {
                    console.error(err);
                    throw new BaseException("File upload error", 400, "Bad Request", "FileUploadError");
                }
                
                const idUser = req.user.id;
                const { publicationId } = req.query;
                const file = req.file;

                if (!file || !idUser) {
                    throw new BaseException("Missing required fields", 400, "Bad Request", "MissingRequiredFields");
                }

                const mimetype = file.mimetype;

                // Guardar el archivo utilizando el servicio
                const idImage = await this.imageService.saveImage(file.buffer, Date.now(), mimetype, idUser);
                await this.imageService.saveRelation(publicationId, idUser, idImage);

                res.status(201).json({ message: 'Imagen guardada exitosamente.', idImage });
            });

        } catch (error) {
            throw new BaseException(`ImageController.uploadImage: ${error.message}`, error.statusCode ?? 400, "Bad Request", "ImageUploadError");
        }
    }

    async getImage(req, res) {
        try {
            const { imageId } = req.params;

            if (!imageId) {
                throw new BaseException("Image ID is required", 400, "Bad Request", "ImageIdRequired");
            }
            const image = await this.imageService.getImageById(imageId);
            if (!image) {
                throw new BaseException("Image not found", 404, "Not Found", "ImageNotFound");
            }
            // Determinar el tipo de imagen basado en la extensión de archivo si es necesario
            res.setHeader('Content-Type', image.mimetype); // Cambiar según el tipo de imagen si es necesario

            // Enviar la imagen como respuesta
            res.status(200).send(image.image);
        } catch (error) {
            throw new BaseException(`ImageController.getImage: ${error.message}`, error.statusCode ?? 500, "Internal Server Error", "GetImageError");
        }
    }
}

module.exports = ImageController;
