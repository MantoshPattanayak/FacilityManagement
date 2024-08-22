const express = require('express')
const {app} = require('./app')
const path = require('path')
let port = process.env.PORT || 8000;
require('dotenv').config({path: path.resolve(__dirname, '../../.env') })
const logger = require('./logger/index.logger')

require('./models')
console.log('logger',logger)
logger.info(`server is listening on port ${port}`);
logger.warn(`server is listening onport ${port}`);
logger.error(`server is listening on port ${port}`);
logger.debug(`server is listening on port ${port}`);
logger.silly(`server is listening on port ${port}`);


app.listen(port, (err) =>{
    if(err) throw err;
    console.log(`server is listening on port ${port}`)
})