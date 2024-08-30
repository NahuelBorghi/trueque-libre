// // Routes for OfferController
const OfferRoutes = require("express").Router();
const OfferController = require("../controller/OfferController.js");
const offerController = new OfferController();
// OfferRoutes.post("/", async (req, res, next) => {
//     try {
//         await offerController.create(req, res);
//     } catch (error) {
//         next(error);
//     }
// });

// OfferRoutes.post("/", async (req, res, next) => {
//     try {
//         await offerController.login(req, res);
//     } catch (error) {
//         next(error);
//     }
// });

// OfferRoutes.put("/", async (req, res, next) => {
//     try {
//         await offerController.update(req, res);
//     } catch (error) {
//         next(error);
//     }
// });

// OfferRoutes.delete("/", async (req, res, next) => {
//     try {
//         await OfferController.delete(req, res);
//     } catch (error) {
//         next(error);
//     }
// });

module.exports = OfferRoutes;