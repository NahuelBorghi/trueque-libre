// // Routes for ImageController
const ImageRoutes = require("express").Router();
const ImageController = require("../controller/ImageController.js");
const imageController = new ImageController();
ImageRoutes.post("/upload", async (req, res, next) => {
    console.log('cors y la concha de tu madre')
    try {
        await imageController.uploadImage(req, res);
    } catch (error) {
        next(error);
    }
});

ImageRoutes.get("/:imageId", async (req, res, next) => {
    try {
        await imageController.getImage(req, res);
    } catch (error) {
        next(error);
    }
});

// ImageRoutes.put("/", async (req, res, next) => {
//     try {
//         await imageController.update(req, res);
//     } catch (error) {
//         next(error);
//     }
// });

// ImageRoutes.delete("/", async (req, res, next) => {
//     try {
//         await ImageController.delete(req, res);
//     } catch (error) {
//         next(error);
//     }
// });

module.exports = ImageRoutes;
