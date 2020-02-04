import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {UserSchema} from "../models/userModel";
import bcrypt from 'bcryptjs';

const User = mongoose.model('User', UserSchema);

export const createUser = (req, res) => {
    let newUser = new User(req.body);
    newUser.save((err, user) => {
        if(err) {
            res.status(400).send(err);
        } else {
            res.status(201).json(user);
        }
    })
};

export const listUsers = (req, res) => {
    if(req.decoded.data.isAdmin === true){
        User.find({})
        .exec((err, users) => {
            if(err) {
                res.status(400).send(err);
            } else {
                res.status(200).json(users)
            }
        })
    }
    else{
        res.status(403)
    }
};

export const getUser = (req, res) => {
    User.findById(req.params.id)
    .exec((err, user) => {
        if(err) {
            res.status(400).send(err);
        } else if(user === null) {
            res.sendStatus(404)
        } else {
            res.status(200).json(user)
        }
    });
};

export const listUserRaces = (req, res) => {
    User.findById(req.params.id)
    .exec((err, user) => {
        if(err) {
            res.status(400).send(err);
        } else if(user === null) {
            res.sendStatus(404)
        } else {
            res.status(200).json(user.races)
        }
    });
};

export const login = (req, res) => {
    User.findOne({username: req.body.username})
    .exec((err, user) => {
        if (user === null) {
            res.sendStatus(404)
        }
        else{
            bcrypt.compare(req.body.password, user.password, function(err, response) {
                if(response) {
                    let token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60), data: {id: user.id, isAdmin: user.isAdmin}}, 'mySuperSecrett');
                    const response = {user: user, token: token}
                    res.status(200).json(response)
                } else {
                    res.sendStatus(404)
                } 
              });
        }
    });
   
};

export const loginAdmin = (req, res) => {
    User.findOne({username: req.body.username})
    .exec((err, user) => {
        if (user === null) {
            res.sendStatus(404)
        }
        else{
            if(user.isAdmin === false){
                res.status(403).send({error: 'boo'})
            }
            else {
                bcrypt.compare(req.body.password, user.password, function(err, response) {
                if(response) {
                    let token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60 * 60), data: {id: user.id, isAdmin: user.isAdmin}}, 'mySuperSecrett');
                    const response = {user: user, token: token}
                    res.status(200).json(response)
                } else {
                    res.sendStatus(404)
                } 
              });
            }
        }
    });
   
};

export const updateUser = (req, res) => {
    if(req.decoded.data.id === req.params.id || req.decoded.data.isAdmin === true){
        User.findOneAndUpdate({"_id": req.params.id}, req.body, {new: true, useFindAndModify: false})
        .exec((err, user) => {
            if(err) {
                res.status(400).send(err);
            } else {
                if(user == null) {
                    res.sendStatus(404);
                }
                else {
                    res.status(200).json(user);
                }
            }
        });
    }
    else{
        res.sendStatus(403)
    }
};

export const deleteUser = (req, res) => {
    if(req.decoded.data.id === req.params.id || req.decoded.data.isAdmin === true){
        User.findOneAndDelete({"_id": req.params.id}, (err, user) => {
            if(err) {
                res.status(400).send(err);
            } else {
                if(user == null) {
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