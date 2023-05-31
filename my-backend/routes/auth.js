const express = require("express");
const router = express.Router();
const path = require('path');
const User = require("../models/user");
const mongoose = require('mongoose');
router.get('/router', (req,res)=>{
    res.send("in router");
});


router.get('/logout', (req, res) =>{
    console.log("User is logging out, destroying the session id");
    req.session.destroy();
    res.redirect("/");
})


router.post('/login', async (req, res) => {
    console.log("User sending a post request on the login page!");
    console.log(req.body);
    const {username , password} = req.body;
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        console.log("User doesn't exist!");
        return res.status(400).json({ message: "User doesn't exist!", sessionID: null }); // User not found
      } else if (user.password !== password) {
        console.log("Wrong password.");
        return res.status(400).json({ message: "Wrong password.", sessionID: null}); // Incorrect password
      } else {
        console.log("Successfully logged in");
        req.session.authenticated = true;
        req.session.username = username;
        return res.status(200).json({ message: "Successfully logged in", sessionID: req.session.id, sessionUsername: req.session.username }); // Login success
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" }); // Server error
    }
  })
router.get('/login',  (req,res) =>{
  
    try{
        res.send("Hello World!");
        console.log("Test User!");
    } catch (error){
        console.log(error);
    }
})
router.post('/signup', async (req,res) =>{
    const user = new User ({
        username: req.body.username,
        password: req.body.password,
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
  console.log("User is logging out, destroying the session id");
  req.session.destroy();
  res.json({message: "Successfully logged out!"});
});
module.exports = router;