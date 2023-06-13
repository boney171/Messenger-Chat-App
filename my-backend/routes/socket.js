const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const User = require('../models/user');
const Room = require('../models/room');
const Messages = require("../models/messages");
// socket.js
const socketSetup = (io) => {
    
      io.on('connection', (socket) => {
        console.log('New client connected: ',socket.request.session.user);
        const user = socket.request.session.user;
        //This function is to alert the server that a user just joins the socket via a room.
        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
        });

    
        //This function receives msg from the user
        //Store message into the database
        //Send back that message to every one in the same room.
        socket.on('message', async (message, room, reaction) => {
          console.log("Message Received: " + message + " From room " + room + " From user: " + user + " Reaction: " + reaction);
          try {
            // Find the user and room documents
            const [foundUser, foundRoom] = await Promise.all([
              User.findOne({ username: user }),
              Room.findOne({ name: room }),
            ]);
        
            if (!foundUser || !foundRoom) {
              // Handle the case when user or room is not found
              console.error('User or Room not found');
              return;
            }
            console.log(foundUser,foundRoom);
            const newMessage = new Messages({
              message: { text: message },
              reactions: { text: reaction },
              sender: foundUser._id,
              room: foundRoom._id,
            });
        
            const dataSaved = await newMessage.save();
            //console.log('Message saved:', dataSaved);
        
            // Access the createdAt field directly from the saved data.
            const time = dataSaved.createdAt;
            //console.log('Message sent at:', time);
            
            // Send back message from user to everyone in the room.
            io.to(room).emit('message', { user, message , time, reaction });
          } catch (err) {
            console.error('Error saving message:', err);
          }
        });

        //User disconnect from a socket
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.request.session.user);
        });
    });
};

module.exports = socketSetup;