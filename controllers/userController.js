const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.createUser = async (req, res)=>{

    //show error mesages from express validator
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    //verify if user is already authenticated
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if(user) {
        res.status(400).json({ msg: 'User already exist' });
    }

    //create new user
    user = new User(req.body);

    //hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    try {
        await user.save();
        res.json({ msg: 'User created successfully' });
    } catch (error) {
        console.log(error);
    }
};