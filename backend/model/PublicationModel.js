const generateId = require("../utils/UUID.js");

class Publication {
    constructor(
        title,
        description,
        ubication,
        creationUser,
        state = "created", // created, published, closed
        status = "active", // active, inactive
        exchange,
        id = generateId(),
        modificationUser = null,
        modificationDate = null,
        creationDate = new Date(),
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.state = state;
        this.status = status;
        this.ubication = ubication;
        this.exchange = exchange;
        this.creationDate = creationDate;
        this.creationUser = creationUser;
        this.modificationDate = modificationDate;
        this.modificationUser = modificationUser;
    }
}

module.exports = Publication;
