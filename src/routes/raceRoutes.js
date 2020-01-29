import { createRace, getRace, updateRace, deleteRace } from "../controllers/raceController.js";
const jwtService = require('../services/jwtService');

export const raceRoutes = (app) => {
    app.use(function (req, res, next){
        jwtService.verifyJwt(req, res, next)
        })
        .route('/race/create')
        .post(createRace);

    app.use(function (req, res, next){
        jwtService.verifyJwt(req, res, next)
        })
        .route('/race/:id')
        .get(getRace);

    app.use(function (req, res, next){
        jwtService.verifyJwt(req, res, next)
        })
        .route('/race/:id')
        .put(updateRace);

    app.use(function (req, res, next){
        jwtService.verifyJwt(req, res, next)
        })
        .route('/race/:id')
        .delete(deleteRace);
}