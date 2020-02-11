import { createRace, getRace, listRaces, statRaces, countryRaces, lengthRaces, updateRace, deleteRace } from "../controllers/raceController.js";
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
        .route('/race/all/stats')
        .get(statRaces)

    app.use(function (req, res, next){
        jwtService.verifyJwt(req,res, next)
        })
        .route('/race/country/stats')
        .get(countryRaces)

    app.use(function (req, res, next){
        jwtService.verifyJwt(req,res, next)
        })
        .route('/race/distances/stats')
        .get(lengthRaces)

    app.use(function (req, res, next){
        jwtService.verifyJwt(req, res, next)
        })
        .route('/race/:id')
        .delete(deleteRace);
}