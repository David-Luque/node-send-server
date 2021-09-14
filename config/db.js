const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' })
//path is where enviroment variables are stored

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindandModify: false,
            // useCreateIndex: true
        });
        console.log('BD successfully connected')
    } catch(error) {
        console.log('There was an error ', error);
        process.exit(1) //to stop the server
    }
};

module.exports = connectDB;