const generateId = require('../utils/UUID.js');

class Image {
    constructor(imageName, mimetype, creationUser, id = null, creationDate = new Date()) {
        this.id = id || generateId();
        this.image = imageName;
        this.mimetype = mimetype;
        this.creationDate = creationDate;
        this.creationUser = creationUser;
    }
}

module.exports = Image;