//Imports
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const route = require('./router/userrouter');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//Connection
mongoose.connect('mongodb://localhost:27017/loginApp');
console.log("Connection Successful");



var multer = require('multer');
var upload = multer({dest: 'images/'});

// MiddleWare
const app = express()
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use('/', express.static(path.join(__dirname, 'static')));
app.use(route)
app.use(upload.array());
// app.use(express.static('public'));


app.listen(3000, ()=>{
    console.log('Server running on port 3000');
})