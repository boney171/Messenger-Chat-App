const express = require("express");
const router = express.Router();
const path = require('path');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
router.get('/router', (req,res)=>{
    res.send("in router");
});



router.post('/login', async (req, res) => {
    console.log("User sending a post request on the login page!");
    console.log(req.body);
    const {username , password} = req.body;
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        console.log("User doesn't exist!");
        return res.json({ message: "User doesn't exist!", sessionID: null }); // User not found
      } else if ( !await bcrypt.compare(req.body.password, user.password)) {
        console.log("Wrong password.");
        return res.json({ message: "Wrong password.", sessionID: null}); // Incorrect password
      } else {
        console.log("Successfully logged in");
        req.session.authenticated = true;
        req.session.user = user.username;
        return res.status(200).json({ message: "Successfully logged in", sessionID: req.session.id, user: req.session.user}); // Login success
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" }); // Server error
    }
  });



router.get('/session', async (req, res) => {
  if (req.session.user) {
    const temp = await User.findOne({ username: req.session.user }).exec();
    res.send({ loggedIn: true, user: req.session.user, name: req.session.user, id: temp._id });
  } else {
    res.send({ loggedIn: false });
  }
});
  

router.post('/signup', async (req,res) =>{
    const hashedPassword = await bcrypt.hash(req.body.password, 15);
    //console.log(hashedPassword);
    const user = new User ({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
    });
    console.log(req.body);
    
    try{
        const dataSaved = await user.save();
        res.status(200).json(dataSaved);
        console.log("User just registered a new account!");
    }catch (error){
        console.log(error);
        res.send("ERROR!");
    }
});

router.get('/logout', (req, res) => {
  console.log("User logged out!, ", req.session.user);
  res.json({loggedOut: true})
  req.session.destroy();
});

module.exports = router;