const generateId = require('../utils/UUID.js');

class User {
    constructor(userName, password, salt, email, state = true, id = null) {
        this.id = id || generateId();
        this.userName = userName;
        this.email = email;
        this.salt = salt;
        this.password = password;
        this.state = state;
    }
}

module.exports = User;