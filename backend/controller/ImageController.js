const BaseException = require("../exceptions/BaseException.js");
const ImageService = require("../service/ImageService.js");
const multer = require('multer');

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
            upload.single('fileData')(req, res, async (err) => {
                if (err) {
                    throw new BaseException("File upload error", 400, "Bad Request", "FileUploadError");
                }
                
                const creationUser = req.body.creationUser;
                const file = req.file;
                const mimetype = file.mimetype;

                if (!file || !creationUser) {
                    throw new BaseException("Missing required fields", 400, "Bad Request", "MissingRequiredFields");
                }
                // Guardar el archivo utilizando el servicio
                const imageId = await this.imageService.saveImage(file.buffer, mimetype, creationUser);
                console.log("Image ID:", imageId);

                res.status(201).json({ message: 'Imagen guardada exitosamente.', imageId });
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
            console.log("Image ID:", imageId);
            const image = await this.imageService.getImageById(imageId);
            if (!image) {
                throw new BaseException("Image not found", 404, "Not Found", "ImageNotFound");
            }
            console.log("Image ID:", image.id);
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
