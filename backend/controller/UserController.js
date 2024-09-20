const BaseException = require('../exceptions/BaseException');
const UserService = require('../service/UserService');
const { generateToken } = require('../utils/jwt');

class UserController {
    constructor() {
        const label = `-------------------- UserController setup - ${Date.now()}`;
        console.time(label);
        this.userService = new UserService();
        console.timeLog(label, 'UserService setup complete');
        console.timeEnd(label);
    }
    async create(req, res) {
        const label = `-------------------- User creation - ${Date.now()}`;
        console.time(label);
        try {
            const { userName, password, email } = req.body;
            await this.userService.createUser(userName, password, email);
            console.timeLog(label, "user created successfully");
            console.timeEnd(label);
            return res.status(201).send({ message: "User created successfully" });
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(`UserController.create: ${error.message}`, error.statusCode??400, "Bad Request", "UserCreationError");
        }
    }
    async login(req, res) {
        const label = `-------------------- User login - ${Date.now()}`;
        console.time(label);
        try {
            const { userName, password} = req.body;
            const user = await this.userService.logInUser(userName, password);
            const token = await generateToken(user);
            console.timeLog(label, "user logged in successfully");
            console.timeEnd(label);
            return res
                .cookie('Authentication', token, { httpOnly: true, path: '/', sameSite: 'None' })
                .status(200)
                .send({ userID: user.id, userName: user.name });
        } catch (error) {
            console.timeEnd(label)
            throw new BaseException(`UserController.login: ${error.message}`, error.statusCode??400, "Bad Request", "UserLoginError");
        }
    }
    async logout(req, res) {
        const label = `-------------------- User logout - ${Date.now()}`;
        console.time(label);
        try {
            const { idUser } = req.body;
            await this.userService.logOutUser(idUser);
            console.timeLog(label, "user logged out successfully");
            console.timeEnd(label);
            return res.status(200).send({ message: 'User logged out' });
        } catch (error) {
            console.timeEnd(label)
            throw new BaseException(`UserController.logout: ${error.message}`, error.statusCode??400, "Bad Request", "UserLogoutError");
        }
    }
    async verify(req, res){
        res.status(200)
    }
}

module.exports = UserController;