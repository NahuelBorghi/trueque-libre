const generateId = require("../utils/UUID.js");

class Offer {
    constructor(
        idUser, //id del usuario que crea la oferta
        chatId, //id del chat
        imageId, //id de la unica imagen
        description,
        modificationUser = null,
        modificationDate = null,
        creationDate = new Date(),
        state = "offered", // offered, denied, chat, accepted, closed
        id = generateId()
    ) {
        this.id = id;
        this.chatId = chatId;
        this.imageId = imageId;
        this.description = description;
        this.state = state;
        this.creationDate = creationDate;
        this.creationUser = idUser;
        this.modificationDate = modificationDate;
        this.modificationUser = modificationUser;
    }
}

module.exports = Offer;
