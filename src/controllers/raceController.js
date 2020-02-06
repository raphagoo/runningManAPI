import mongoose from 'mongoose';
import moment from 'moment'
import { RaceSchema } from "../models/raceModel";
import { UserSchema } from "../models/userModel";
import NodeGeocoder from 'node-geocoder'
const Race = mongoose.model('Race', RaceSchema);
const User = mongoose.model('User', UserSchema);

let options = {
    provider: 'google',
    httpAdaptater: 'https',
    apiKey: 'AIzaSyDhQd_OqySckHoHuLuvXkn0fPfNK8PzZ88'
}

let geocoder = NodeGeocoder(options)

export const createRace = (req, res) => {
    if(req.decoded.data.id === req.params.id || req.decoded.data.isAdmin === true){
        let newRace = new Race(req.body);
        newRace.save((err, race) => {
            if(err) {
                res.status(400).send(err);
            } else {
                User.findOne({"_id": req.decoded.data.id})
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
        res.sendStatus(403)
    }
};

const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

export const countryRaces = (req, res) => {
    if(req.decoded.data.isAdmin === true){
        Race.find({})
        .exec((err, races) => {
            if(err) {
                res.status(400).send(err);
            } else {
                let wideListCountry = []
                const geocodePromises = races.map(race => {
                    geocoder.reverse({lat: race.startPosLat, lon: race.startPosLong})
                    .then(response => {
                        response.forEach(place => {
                            wideListCountry.push(place.country)
                        })
                    })
                })
                Promise.all(geocodePromises).then(() => {
                    console.log(wideListCountry)
                    res.status(200).json(races)
                })
                
            }
        })
    }
    else{
        res.status(403)
    }
}

export const statRaces = (req, res) => {
    let end = moment(new Date()).toDate()
    let start = moment(new Date()).subtract(7, 'days').toDate()
    if(req.decoded.data.isAdmin === true){
        Race.find({date: {'$gte':  start, '$lte': end}})
        .exec((err, races) => {
            if(err) {
                res.status(400).send(err);
            } else {
                let statsLastWeek = []
                for(let i = 7; i > 0; i--){
                    statsLastWeek.push({date: moment(new Date()).subtract(i, 'days').toDate(), count: 0})
                }
                races.forEach(race => {
                    statsLastWeek.forEach(stat => {
                        if(datesAreOnSameDay(race.date, stat.date) === true){
                            stat.count++
                        }
                    })
                })
                res.status(200).json({races: races, stats: statsLastWeek})
            }
        })
    }
    else{
        res.status(403)
    }
}

export const listRaces = (req, res) => {
    if(req.decoded.data.isAdmin === true){
        Race.find({})
        .exec((err, races) => {
            if(err) {
                res.status(400).send(err);
            } else {
                res.status(200).json(races)
            }
        })
    }
    else{
        res.status(403)
    }
};

export const getRace = (req, res) => {
    if(req.decoded.data.id === req.params.id || req.decoded.data.isAdmin === true){
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
    }
    else{
        res.sendStatus(403)
    }
};

export const updateRace = (req, res) => {
    if(req.decoded.data.id === req.params.id || req.decoded.data.isAdmin === true){
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
    }
    else{
        res.sendStatus(403)
    }
};

export const deleteRace = (req, res) => {
    if(req.decoded.data.id === req.params.id || req.decoded.data.isAdmin === true){
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
    }
    else{
        res.sendStatus(403)
    }
};