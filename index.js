const express = require('express');
const router = require('./src/route');
const connection = require('./src/Schema/connection');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use('/Bank', router);

app.listen(process.env.PORT,()=>{
    console.log('Listening port is 3000');
})