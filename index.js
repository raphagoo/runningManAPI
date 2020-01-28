import express from 'express';
let app = require('express')();
let http = require('http').createServer(app);

import mongoose from 'mongoose';


import { userRoutes } from "./src/routes/userRoutes.js";
import { raceRoutes } from "./src/routes/raceRoutes.js";

const PORT = 3000;


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});

export const autoIncrement = require('mongoose-auto-increment');

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/runningMan', {
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


http.listen(PORT, 
    console.log(`listening on port ${PORT}`)
);