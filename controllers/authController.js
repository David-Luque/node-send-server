const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

exports.authenticateUser = async (req, res, next)=>{
    const { email, password } = req.body;
    
    //check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    //find the user
    const user = await User.findOne({ email });
    
    //verify user
    if(!user) {
        res.status(401).json({ msg: "User do not exist" });
        return next();
    }
    
    //verify password
    const isCorrectPass = bcrypt.compareSync(password, user.password);
    if(!isCorrectPass) {
        res.status(400).json({ msg: "Incorrect password" });
        return next();
    }

    //--AUTH USER--
    //create payload
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email
    }
    // create JWT
    const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: '8h'
    });

    res.json({ token });
};

exports.userAuthenticated = (req, res, next)=>{
    res.json({ user: req.user });
};