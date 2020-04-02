import express from 'express';
let app = require('express')();
let http = require('http').createServer(app);

/**
 * Socket initialisation
 */
export let io = require('socket.io')(http, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
}});

import mongoose from 'mongoose';

/**
 * Routing imports
 */
import { userRoutes } from "./src/routes/userRoutes.js";
import { raceRoutes } from "./src/routes/raceRoutes.js";
import {updateRaceSocket} from "./src/controllers/raceController";

const PORT = 3000;

/**
 * Socket events
 */
io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    socket.on('disconnect', () => {
        console.log(`socket ${socket.id} disconnected`);
    });

    /**
     * On updateRace event, update or add the different field from the race entry
     */
    socket.on('updateRace', (socket) => {
        console.log(socket)
        updateRaceSocket(socket)
    });
});

/**
 * CORS authorizations
 */
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    next();
});

export const autoIncrement = require('mongoose-auto-increment');


// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://raphAdmin:kakashi%2313@raphcluster-hjbxp.mongodb.net/projetUf?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, error => {
    if(error) {
        console.log(error);
        process.exit(1);       
    }
});

// Routes initialisation
userRoutes(app);
raceRoutes(app);


http.listen(process.env.PORT || PORT);
