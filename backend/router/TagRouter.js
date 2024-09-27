// // Routes for TagController
const TagRoutes = require("express").Router();
const TagController = require("../controller/TagController.js");
const tagController = new TagController();
TagRoutes.get("/", async (req, res, next) => {
    try {
        await tagController.get(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = TagRoutes;
