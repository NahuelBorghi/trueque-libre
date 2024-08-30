const generateId = require('../utils/UUID.js');

class Image {
    constructor(image, mimetype, creationUser, id = null) {
        this.id = id || generateId();
        this.image = image;
        this.mimetype = mimetype;
        this.creationDate = new Date();
        this.creationUser = creationUser;
    }
}

module.exports = Image;