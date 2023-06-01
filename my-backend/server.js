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


// Configure body-parser middleware to parse request bodies

dotenv.config();
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}));

app.use(session({
    secret: "myTempKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // set this to true in production, only work with https
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },

}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

/*End of middleware configs */

/* Database set up */
let connect = "mongodb+srv://boney1711:j1zliceCDkRmYT6C@cluster0.g38qpg2.mongodb.net/?retryWrites=true&w=majority";

//console.log(process.env.MONGO_URL)
mongoose.connect(connect);
const database = mongoose.connection;

database.once("connected", () =>{
    console.log("Connected to the DB!")
})

/* End of database set up */

const auth = require('./routes/auth');
const rooms = require('./routes/rooms');



app.get('/', (req,res) =>{
    if(req.session && req.session.authenticated){ //If user exists and is authenticated
        res.send("Welcome old friend " + req.session.username );
    } else res.send("Welcome new comer!");
});

app.use('/api/auth/', auth);


// checking the session before accessing the rooms
app.use((req, res, next) => {
    if (req.session && req.session.authenticated) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  });

app.use("/api/rooms/", rooms);




app.listen(port, () => console.log("Hi, your server is running!!"));