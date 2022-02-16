const Link = require('../models/Link');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newLink = async (req, res, next)=>{
    //check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() })
    }

    console.log("Sending this: ", req.body)
    const { origin_name, name } = req.body;

    //create new Link object
    const link = new Link();
    link.url = shortid.generate();
    link.name = name;
    link.origin_name = origin_name;
    

    //if user is authenticated
    if(req.user) {
        const { downloads, password } = req.body;
        //assign downloads number to link 
        if(downloads) link.downloads = downloads;
        //asign a password
        if(password) {
            const salt = await bcrypt.genSalt(10);
            link.password = await bcrypt.hash(password, salt);
        };
        //asign author
        link.author = req.user.id
    }
    
    //store link in DB
    try {
        await link.save();
        res.json({ msg: `${link.url}` });
        return next();
    } catch(error) {
        console.log(error)
    }
};


//get all links
exports.allLinks = async (req, res)=>{
    try {
        const links = await Link.find({}).select('url -_id');
        res.json({ links });
    } catch (error) {
        console.log(error)
    }
};


//return if link has password or not
exports.hasPass = async (req, res, next)=>{
    //verify if url exist
    const link = await Link.findOne({ url: req.params.url })
    if(!link) {
        res.status(404).json({ msg: 'This link do not exist' });
    }

    if(link.password) {
        return res.json({
            password: true,
            link: link.url,
            file: link.name

        });
    }

    next();
};

//verify file password
exports.verifyPassword = async (req, res, next)=>{
    const link = await Link.findOne({ url: req.params.url });
    
    //verify password
    const { password } = req.body;
    const correctPass = bcrypt.compareSync(password, link.password);
    if(correctPass) {
        next(); // to download the file
    } else {
        return res.status(401).json({ msg: 'Incorrect password' })
    }
};


//get link
exports.getLink = async (req, res, next)=>{
    //verify if url exist
    const link = await Link.findOne({ url: req.params.url });

    if(!link) {
        res.status(404).json({ msg: 'This link do not exist' });
    }
    
    //if link exist
    res.json({
        file: link.name,
        password: false
    });

    next();
};