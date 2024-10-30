// // Routes for UserController
const UserRoutes = require("express").Router();
const UserController = require("../controller/UserController.js");
const User = require("../model/UserModel.js");
const userController = new UserController();

UserRoutes.post("/register", async (req, res, next) => {
    try {
        await userController.create(req, res);
    } catch (error) {
        next(error);
    }
});

UserRoutes.post("/login", async (req, res, next) => {
    try {
        await userController.login(req, res);
    } catch (error) {
        next(error);
    }
});

UserRoutes.put("/logout", async (req, res, next) => {
    try {
        await userController.logout(req, res);
    } catch (error) {
        next(error);
    }
});

// UserRoutes.delete("/", async (req, res, next) => {
//     try {
//         await UserController.delete(req, res);
//     } catch (error) {
//         next(error);
//     }
// });

UserRoutes.get("/verify", async (req, res, next)=>{
    try{
        await userController.verify(req, res);
    } catch (error){
        next(error);
    }
})

UserRoutes.get("/userById", async (req, res, next)=>{
    try{
        await userController.getUserById(req, res);
    } catch (error){
        next(error);
    }
})

module.exports = UserRoutes;