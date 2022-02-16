const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

module.exports = (req, res, next)=>{
    const authHeader = req.get('Authorization');
    if(authHeader) {
        //get the token
        const token = authHeader.split(' ')[1];
        
        //check the token
        try {
            const user = jwt.verify(token, process.env.SECRET);
            req.user = user;
            
        } catch(error) {
            console.log('JWT not valid');
            console.log(error);
        }   
    };

    return next();
}; 