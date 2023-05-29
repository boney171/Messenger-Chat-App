const express = require('express');
const app = express()
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');
const port = 3001;
const session = require("express-session");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require("./models/user");
const cors = require('cors');
//username: boney1711
//password:j1zliceCDkRmYT6C

dotenv.config();
// Configure body-parser middleware to parse request bodies


app.use(cors());

app.use(session({
    secret: "myTempKey",
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let connect = "mongodb+srv://boney1711:j1zliceCDkRmYT6C@cluster0.g38qpg2.mongodb.net/?retryWrites=true&w=majority";
const auth = require('./routes/auth')
app.use('/api/auth/', auth);
//console.log(process.env.MONGO_URL)
mongoose.connect(connect);
const database = mongoose.connection;

database.once("connected", () =>{
    console.log("Connected to the DB!")
})

app.get('/', (req,res) =>{
    if(req.session && req.session.authenticated){ //If user exists and is authenticated
        res.send("Welcome old friend " + req.session.username );
    } else res.send("Welcome new comer!");
});

app.get('/mainPage', (req,res) =>{
    res.send("Welcome to the home page!")
});

app.get('/logout', (req, res) =>{
    console.log("User is logging out, destroying the session id");
    req.session.destroy();
    res.redirect("/");
})



app.listen(port, () => console.log("Hi, your server is running!!"));