import mongoose from 'mongoose';
import { RaceSchema } from "../models/raceModel";
import { UserSchema } from "../models/userModel";
const jwtService = require('../services/jwtService');
const Race = mongoose.model('Race', RaceSchema);
const User = mongoose.model('User', UserSchema);

export const createRace = (req, res) => {
    let tokenInfos = jwtService.verifyJwt(req)
    if(tokenInfos !== false){
        let newRace = new Race(req.body);
        newRace.save((err, race) => {
            if(err) {
                res.status(400).send(err);
            } else {
                User.findOne({"_id": tokenInfos.data.id})
                .exec((err, user) => {
                    if(err){
                        console.log(err)   
                    }
                    else{
                        user.races.push(race)
                        user.save()
                    }
                res.status(201).json(race);
                })
            }
        })

    }
    else{
        res.sendStatus(403);
    }
};

export const getRace = (req, res) => {
    Race.findById(req.params.id)
    .exec((err, race) => {
        if(err) {
            res.status(400).send(err);
        } else if(race == null) {
            res.sendStatus(404)
        } else {
            res.status(200).json(race)
        }
    });
};

export const updateRace = (req, res) => {
    Race.findOneAndUpdate({"_id": req.params.id}, req.body, {new: true, useFindAndModify: false})
    .exec((err, race) => {
        if(err) {
            res.status(400).send(err);
        } else {
            if(race == null) {
                res.sendStatus(404);
            }
            else {
                res.status(200).json(race);
            }
        }
    });
};

export const deleteRace = (req, res) => {
    Race.findOneAndDelete({"_id": req.params.id}, (err, race) => {
        if(err) {
            res.status(400).send(err);
        } else {
            if(race == null) {
                res.sendStatus(404);
            }
            else {
                res.sendStatus(204);
            }
        }
    });
};