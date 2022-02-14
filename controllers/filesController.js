const multer = require('multer');
const shortId = require('shortid');
const fs = require('fs');
const Link = require('../models/Link');


exports.uploadFile = async (req, res, next)=>{

    const multerCongif = {
        limits: { 
            fileSize: req.user ? 1024*1024*10 : 1024*1024 //10MB - 1MB
        },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb)=>{
                cb(null, __dirname + '/../uploads')
            },
            filename: (req, file, cb)=>{
                const extension = file.originalname.substr(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortId.generate()}.${extension}`);
            },
            // fileFilter: (req, file, cb)=>{
            //     if(file.mimetype === 'application/pdf') {
            //         return cb(null, true)
            //     }
            // }
            //THIS MEANS THAT WE DO NOT ACCEPT PDF FILES. THE "true" MEANS AN ERROR
        })
    };

    const upload = multer(multerCongif).single('theFile');

    upload(req, res, async(error) => {
        console.log(req.file);
        
        if(!error) {
            res.json({ file: req.file.filename });
        } else {
            console.log(error);
            return next();
        }
    })
};

exports.downloadFile = async (req, res, next) => {
    const { file } = req.params;
    
    //get link
    const link = await Link.findOne({ name: file })
    
    const fileToDownload = __dirname + "/../uploads/" + file;
    res.download(fileToDownload);

    //check how many downloads remains
    const { downloads, name } = link;

    if(downloads === 1) {
        //delete file
        req.file = name;

        //delete access from db
        await Link.findByIdAndRemove(link._id)
        
        next();
    } else {
        link.downloads--;
        await link.save();
    }
};

exports.deleteFile = (req, res)=>{
    console.log(req.file)

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.file}`);
        console.log('file deleted')
    } catch (error) {
        console.log(error)
    }
};