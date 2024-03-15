const express = require('express')
const {app} = require('./app')
const path = require('path')

require('dotenv').config({path: path.resolve(__dirname, '../../.env') })

require('./models')




app.listen(process.env.PORT, function (err,data){
    if(err) throw err;
    console.log(`server is listening on port ${process.env.PORT}`)
})