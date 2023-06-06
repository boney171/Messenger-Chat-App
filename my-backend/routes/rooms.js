const express = require('express');
const router = express.Router();
const Room = require("../models/room");
const User = require("../models/user");
// TODO: add rest of the necassary imports
const Messages = require("../models/messages");




// temporary rooms
let rooms = []

//get all active rooms of the user
router.get('/all', async (req, res) => {
    try {
        const allRooms = await Room.find({});
        //console.log("All rooms in the database", allRooms);
        res.status(200).json(allRooms);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/all', async (req, res) => {
    try {
        const allRooms = await Room.find({});
        res.status(200).json(allRooms);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/create', async (req, res) => {
    const roomName = req.body.name;

    //Find inside the database, if that name already exists
    try {
        const existingRoom = await Room.findOne({ name: roomName });
        console.log(existingRoom);
        // If the room already exists
        if (existingRoom) {
            console.log("room already exists");
            return res.status(400).json({ message: "Room name already exists, please choose a unique name!" });
        }
        else {
            // Create a new room object if the room doesn't exist
            const newRoom = new Room({ name: roomName });
            const dataSaved = await newRoom.save();
            console.log("User just created a new room!");
            return res.status(200).send({ message: "Successfully created a new chat room name: " + roomName });
        }
    } catch (error) {
        console.log(error);
        // You should also send a response when there is an error, otherwise your request will hang
        res.status(500).json({ message: "Server error" });
    }
});




router.get('/messages', async (req, res) => {
    console.log("Attempting to get all messages");
    try {
        const room = req.query.room;
        //console.log("Room:", room);
        const roomValue = await Room.findOne({ name: room }).exec();
        const room_id = roomValue._id;
        //console.log("Room id: ", room_id);
        const existingMessages = await Messages.find({ room: room_id });
        res.status(200).json(existingMessages);
        //console.log(existingMessages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed to get messages" });
    }
});

router.get('/user', async (req, res) => {
    try {
        const id = req.query.user;
        const user = await User.findOne({ _id: id }).exec();
        if (user) {
            const username = user.username;
            res.status(200).send(username);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get username" });
    }
});




router.post('/join', async (req, res) => {
    console.log("User trying to join a room in server");

    const user = req.session.user;
    const room = req.body.room;
    const databaseUser = await User.findOne({ username: user });

    if (databaseUser.rooms.includes(room)) {
        res.send({ user: databaseUser.username, rooms: databaseUser.rooms });
        return;
    }

    databaseUser.rooms.push(room);
    await databaseUser.save();
    console.log(databaseUser.rooms);
    res.send({ user: databaseUser.username, rooms: databaseUser.rooms });
});

router.delete('/leave', async (req, res) => {
    try {
        console.log("User trying to leave room!");
        const user = req.session.user;
        const room = req.body.room;
        const databaseUser = await User.findOne({ username: user });

        if (!databaseUser) {
            res.status(404).send({ message: "User not found" });
            return;
        }

        databaseUser.rooms = databaseUser.rooms.filter(r => r !== room);
        await databaseUser.save();
        console.log(databaseUser.rooms);
        res.status(200).send({ message: "User successfully left the chat room!", rooms: databaseUser.rooms });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred" });
    }
});

module.exports = router;