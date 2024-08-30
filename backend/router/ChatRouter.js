// // Routes for ChatController
const ChatRoutes = require("express").Router();
const ChatController = require("../controller/ChatController.js");
const chatController = new ChatController();
// ChatRoutes.post("/register", async (req, res, next) => {
//     try {
//         await chatController.create(req, res);
//     } catch (error) {
//         next(error);
//     }
// });

// ChatRoutes.post("/login", async (req, res, next) => {
//     try {
//         await chatController.login(req, res);
//     } catch (error) {
//         next(error);
//     }
// });

// ChatRoutes.put("/", async (req, res, next) => {
//     try {
//         await chatController.update(req, res);
//     } catch (error) {
//         next(error);
//     }
// });

// ChatRoutes.delete("/", async (req, res, next) => {
//     try {
//         await chatController.delete(req, res);
//     } catch (error) {
//         next(error);
//     }
// });

module.exports = ChatRoutes;