import { createRace, getRace, listRaces, lastWeekRaces, updateRace, deleteRace } from "../controllers/raceController.js";
const jwtService = require('../services/jwtService');

/**
 * Routes for Race model
 * @param {*} app 
 */
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
        .patch(updateRace);

    app.use(function (req, res, next){
        jwtService.verifyJwt(req,res, next)
        })
        .route('/race')
        .get(listRaces)

    app.use(function (req, res, next){
        jwtService.verifyJwt(req,res, next)
        })
        .route('/race/last/week')
        .get(lastWeekRaces)
   
        app.use(function (req, res, next){
        jwtService.verifyJwt(req, res, next)
        })
        .route('/race/:id')
        .delete(deleteRace);
}