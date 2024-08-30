const generateId = require("../utils/UUID.js");

class Publication {
    constructor(
        title,
        // images,
        description,
        // tags,
        creationUser,
        modificationUser = null,
        modificationDate = null,
        creationDate = new Date(),
        status = "active",
        id = generateId()
    ) {
        this.id = id;
        // this.images = images;
        this.title = title;
        this.description = description;
        // this.tags = tags;
        this.status = status;
        this.creationDate = creationDate;
        this.creationUser = creationUser;
        this.modificationDate = modificationDate;
        this.modificationUser = modificationUser;
    }
}

module.exports = Publication;
