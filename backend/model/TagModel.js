const generateId = require("../utils/UUID.js");

class Tag {
    constructor(userName, id = null) {
        this.id = id || generateId();
        this.tagName = tagName;
    }
}

module.exports = Tag;
