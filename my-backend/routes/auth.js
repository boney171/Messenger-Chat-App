const express = require("express");
const router = express.Router();
const path = require('path');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const speakeasy = require("speakeasy");
const qrcode = require('qrcode');
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
        return res.json({ message: "User doesn't exist!", loggedIn: false }); // User not found
      } else if ( !await bcrypt.compare(req.body.password, user.password)) { //New changes for encrypted passwords
        console.log("Wrong password.");
        return res.json({ message: "Wrong password.", loggedIn: false}); // Incorrect password
      } else {
        console.log("User enterred correct username and password");
        //req.session.authenticated = true;
        //req.session.user = user.username;
        return res.status(200).json({ message: "correct", loggedIn: true}); // Login success
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" }); // Server error
    }
  });


  router.get('/verify', (req, res) => {
    // Generate a secret
    const secret = speakeasy.generateSecret({
        name: "TriDev",
    });
    console.log(secret);
    // Generate a time-based token based on the secret
    const token = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32'
    });
    
    qrcode.toDataURL(secret.otpauth_url, (err, data) => {
        if (err) {
            // If there was an error, send a 500 status and the error message
            res.status(500).json({ error: err.message });
        } else {
            // If there was no error, send the QR code data and the token
            res.json({ qrcode: data, token: token, secret: secret.base32});
        }
    });
  });
  
  router.post('/verify', (req, res) => {
    console.log(req.body);
    const verify = speakeasy.totp.verify({
      secret: req.body.secret,
      encoding: 'base32',
      token: req.body.token,
  });
    if(verify === true){
      console.log("Successfully logged in");
          req.session.authenticated = true;
          req.session.user = req.body.user;
          return res.status(200).json({ message: "Successfully logged in", loggedIn: true, user: req.session.user}); // Login success
    } else{
        res.json({message: "Wrong token, try again"});
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
    const hashedPassword = await bcrypt.hash(req.body.password, 15); //Added for hashed passwords
    //console.log(hashedPassword);
    const user = new User ({
        username: req.body.username,
        password: hashedPassword, //Added for hashed passwords
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