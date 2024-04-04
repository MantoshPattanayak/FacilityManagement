const express = require('express')
const app = express();
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../../.env') })
const port = process.env.PORT || 7100 

const cors = require('cors');
var cookieParser = require('cookie-parser')
let api_version = process.env.API_VERSION;

require('dotenv').config({path: path.resolve(__dirname, '../../.env') })

const {requestLogger,errorLogger}=require('./middlewares/logger.middlewares')

console.log(port,'port')
const maproute = require('./routes/api/' + api_version +'/configuration/facilites')
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))

// here in the express.urlencoded i.e. extended is equal to true means inside object we can give another object
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

//  here to access the public assets like images, folders
app.use(express.static("public"))


//  Here cookie parser is used to do crud operation in the user cookie by the server
app.use(cookieParser())

// Use the informational logger middleware before all route handlers
app.use(requestLogger);

app.use('/mapData',maproute)

//  put all your route handlers here






// Use error logger middleware after all route handlers
app.use(errorLogger);


module.exports = {
    app
}