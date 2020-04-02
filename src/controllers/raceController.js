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
                let promises = [];
                for(let i = 0; i < races.length;i++){
                    promises.push(geocoder.reverse({lat: races[i].startPosLat, lon: races[i].startPosLong}))
                }
                Promise.all(promises)
                .then(response => {
                    response.forEach(location => {
                        location.forEach(place => {
                            wideListCountry.push(place.country)
                        })
                    })
                    let counts = {};
                    wideListCountry.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
                    let result = Object.entries(counts);
                    res.status(200).json(result)
                })
                .catch((e) => {
                    console.log(e)
                })
            }
        })
    }
    else{
        res.status(403)
    }
}

export const lengthRaces = (req, res) => {
    if(req.decoded.data.isAdmin === true){
        Race.find({})
        .exec((err, races) => {
            if(err) {
                res.status(400).send(err);
            } else {
                let distances = {'< 2km': 0, '2 to 5km': 0, '5 to 10km':0, '> 10km':0}
                races.forEach(race => {
                    if(race.distance < 2000){
                        distances['< 2km']++
                    }
                    else if (2000 < race.distance && race.distance < 5000){
                        distances['2 to 5km']++
                    }
                    else if (5000 < race.distance && race.distance < 10000){
                        distances['5 to 10km']++
                    }
                    else{
                        distances['> 10km']++
                    }
                })
                let result = Object.entries(distances);
                res.status(200).json(result)
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
    if(req.infos){
        Race.findOneAndUpdate({"_id": req.infos._id}, req.body, {new: true, useFindAndModify: false})
            .exec();
    }

    else if(req.params){
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
