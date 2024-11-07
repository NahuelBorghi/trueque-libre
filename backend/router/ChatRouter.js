const ChatRoutes = require("express").Router();
const ChatController = require("../controller/ChatController.js");
const chatController = new ChatController();

ChatRoutes.get("/events/:userId", async (req, res, next) => {
    try {
        await chatController.getEvents(req, res);
    } catch (error) {
        next(error);
    }
});

ChatRoutes.post("/send", async (req, res, next) => {
    try {
        await chatController.sendMessage(req, res);
    } catch (error) {
        next(error);
    }
});

ChatRoutes.put("/read", async (req, res, next) => {
    try {
        await chatController.readMessage(req, res);
    } catch (error) {
        next(error);
    }
});

ChatRoutes.post("/create", async (req, res, next) => {
    try {
        await chatController.createChat(req, res);
    } catch (error) {
        next(error);
    }
});

ChatRoutes.get("/chats/:userId", async (req, res, next) => {
    try {
        await chatController.findChats(req, res);
    } catch (error) {
        next(error);
    }
});

ChatRoutes.get("/messages/:chatId", async (req, res, next) => {
    try {
        await chatController.getMessages(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = ChatRoutes;