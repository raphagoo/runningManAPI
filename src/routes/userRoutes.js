import { createUser, login, loginAdmin, listUsers,listUserRaces, getUser, updateUser, deleteUser } from "../controllers/userController.js";
const jwtService = require('../services/jwtService');


/**
 * Routes for User model
 * @param {*} app 
 */
export const userRoutes = (app) => {
    app.route('/register')
        .post(createUser);

    app.route('/login')
        .post(login);

    app.route('/loginAdmin')
        .post(loginAdmin);

    app.use(function (req, res, next){
        jwtService.verifyJwt(req, res, next)
        })
        .route('/user/list')
        .get(listUsers);

    app.use(function (req, res, next){
        jwtService.verifyJwt(req, res, next)
        })
        .route('/user/:id/races/')
        .get(listUserRaces);

    app.use(function (req, res, next){
        jwtService.verifyJwt(req, res, next)
        })
        .route('/user/:id')
        .get(getUser);

    app.use(function (req, res, next){
        jwtService.verifyJwt(req, res, next)
        })
        .route('/user/:id')
        .put(updateUser);

    app.use(function (req, res, next){
        jwtService.verifyJwt(req, res, next)
        })
        .route('/user/:id')
        .delete(deleteUser);
}