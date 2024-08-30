const routes = require("express").Router();
const UserRoutes = require("./router/UserRouter.js");
// const PublicationRoutes = require("./router/PublicationRouter.js");
// const ChatRoutes = require("./router/ChatRouter.js");
// const OfferRoutes = require("./router/OfferRouter.js");
const ImageRoutes = require("./router/ImageRouter.js");

routes.use("/user", UserRoutes);
// routes.use("/publication", PublicationRoutes);
// routes.use("/chat", ChatRoutes);
// routes.use("/offer", OfferRoutes);
routes.use("/image", ImageRoutes);

module.exports = routes;