const http = require('http');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');
const port = 3001;
const app = express();
const server = http.createServer(app);
const session = require("express-session");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require("./models/user");
const cors = require('cors');
const cookieParser = require("cookie-parser");


dotenv.config();

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
}));

//Set up all the middlewares
const sessionMiddleware = session({
    secret: "myTempKey",
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
});

app.use(cookieParser());
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});


//Database set up
mongoose.connect(process.env.MONGO_URL);
const database = mongoose.connection;

database.once("connected", () =>{
    console.log("Connected to the DB!")
})


//Set up all routings
const auth = require('./routes/auth');
const rooms = require('./routes/rooms');
const socketSetup = require('./routes/socket');

app.get('/', (req,res) => {
    if(req.session && req.session.authenticated){
        res.send("Welcome old friend " + req.session.username );
    } else res.send("Welcome new comer!");
});

app.use('/api/auth/', auth);


//Current user have to have an active session
//To go to room
app.use((req, res, next) => {
    if (req.session && req.session.authenticated) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
});

app.use("/api/rooms/", rooms);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

// only allow authenticated users
/*
io.use((socket, next) => {
  const session = socket.request.session;
  if (session && session.authenticated) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
});
*/

socketSetup(io);

// Change this to server.listen
server.listen(port, () => console.log(`Server is running on port ${port}`));