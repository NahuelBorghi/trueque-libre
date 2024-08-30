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
//
// PublicationRoutes.post("/", async (req, res, next) => {
//     try {
//         await publicationController.login(req, res);
//     } catch (error) {
//         next(error);
//     }
// });
//
// PublicationRoutes.put("/", async (req, res, next) => {
//     try {
//         await publicationController.update(req, res);
//     } catch (error) {
//         next(error);
//     }
// });
//
// PublicationRoutes.delete("/", async (req, res, next) => {
//     try {
//         await PublicationController.delete(req, res);
//     } catch (error) {
//         next(error);
//     }
// });

module.exports = PublicationRoutes;