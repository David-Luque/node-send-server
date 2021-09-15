const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

//create server
const app = express();

//DB connection
connectDB();

//enable cors
app.use(cors({
    origin: process.env.FRONTEND_URL
}));

//app PORT
const port = process.env.PORT || 4000

//enable to read body values
app.use(express.json());

//enable public directory
app.use(express.static('uploads'));

//app routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));
app.use('/api/files', require('./routes/files'));

//start the app
app.listen(port, '0.0.0.0', ()=>{
    console.log(`Server listening at port ${port}`)
});