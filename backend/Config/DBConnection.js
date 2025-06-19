const mongoose = require('mongoose');

const USERURL = String(process.env.DB_URL);

const USERDB = mongoose.createConnection(USERURL);

USERDB.on('connected',()=>{
    console.log('User DB connected');
});

USERDB.on('error',(err)=>{
    console.log('User DB error:',err);
});

module.exports = {
    USERDB
};