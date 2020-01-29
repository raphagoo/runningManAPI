import { createUser, login, listUsers,listUserRaces, getUser, updateUser, deleteUser } from "../controllers/userController.js";

export const userRoutes = (app) => {
    app.route('/user/register')
        .post(createUser);

    app.route('/user/login')
        .post(login);

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