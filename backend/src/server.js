const express = require('express')
const {app} = require('./app')
require('./models')
require('dotenv').config({path: path.resolve(__dirname, '../../.env') })



app.listen(port, function (err,data){
    if(err) throw err;
    console.log(`server is listening on port ${port}`)
})