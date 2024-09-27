// // Routes for PublicationController
const PublicationRoutes = require("express").Router();
const PublicationController = require("../controller/PublicationController.js");
const publicationController = new PublicationController();
PublicationRoutes.post("/", async (req, res, next) => {
    try {
        await publicationController.create(req, res);
    } catch (error) {
        next(error);
    }
});
PublicationRoutes.get("/", async (req, res, next) => {
    try {
        await publicationController.get(req, res);
    } catch (error) {
        next(error);
    }
});
PublicationRoutes.get("/:id", async (req, res, next) => {
    try {
        await publicationController.getById(req, res);
    } catch (error) {
        next(error);
    }
});
PublicationRoutes.get("/user/:idUser", async (req, res, next) => {
    try {
        await publicationController.getByUserId(req, res);
    } catch (error) {
        next(error);
    }
});
PublicationRoutes.put("/", async (req, res, next) => {
    try {
        await publicationController.update(req, res);
    } catch (error) {
        next(error);
    }
});
// PublicationRoutes.delete("/:id", async (req, res, next) => {
//     try {
//         await publicationController.delete(req, res);
//     } catch (error) {
//         next(error);
//     }
// });


module.exports = PublicationRoutes;