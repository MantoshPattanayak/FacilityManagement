const express = require('express')
const app = express();
const port = process.env.PORT || 7100 
const cors = require('cors');
var cookieParser = require('cookie-parser')

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
// here in the express.urlencoded i.e. extended is equal to true means inside object we can give another object


app.use(express.static("public"))

//  here to access the public assets like images, folders

app.use(cookieParser())

//  Here cookie parser is used to do crud operation in the user cookie by the server

module.exports = {
    app
}