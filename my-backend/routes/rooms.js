const express = require('express');
const router = express.Router();
const Room = require("../models/room");
// TODO: add rest of the necassary imports




// temporary rooms
let rooms = []

//get all active rooms of the user
router.get('/all', async (req, res) => {
    try {
        const allRooms = await Room.find({});
        console.log("All rooms in the database", allRooms);
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
            return res.status(200).send({message:"Successfully created a new chat room name: " + roomName});
        }
    } catch (error) {
        console.log(error);
        // You should also send a response when there is an error, otherwise your request will hang
        res.status(500).json({ message: "Server error" });
    }
});




router.post('/join', (req, res) => {
    // TODO: write necassary codes to join a new room
});

router.delete('/leave', (req, res) => {
    // TODO: write necassary codes to delete a room
});

module.exports = router;