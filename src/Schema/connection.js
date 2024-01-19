const mongoose = require('mongoose');
require('dotenv').config();

const connect = mongoose.connect(process.env.MONGO_URL)
                .then(()=>console.log('Database connect'))
                .catch((err)=>console.log(err));


module.exports = connect;