const  { RateLimiterMemory   }  = require('rate-limiter-flexible');

let RateLimitStore = require('../config/rateLimiter.config');
const statusCode = require('../utils/statusCode')
const { sequelize, Sequelize } = require('../models')
const db = require('../models')
const QueryTypes = db.QueryTypes

let rateLimitModel = db.rateLimitModel

let logger = require(`../logger/index.logger`)

let rateLimiter = new RateLimiterMemory ({
    store:RateLimitStore,
    points:2,
    duration:60
})

let rateLimitFunction = async(req,res,next)=>{
    try {
       let a =  await rateLimiter.consume(req.ip);
        console.log(a,'inside the rate limiter function', req.ip, 'rate limiter', rateLimiter, 'rate limit store')
        next(); // proceed if allowed
    } catch (err) {
        logger.error(`An error occurred: ${err.message}`); // Log the error
        return res.status(statusCode.TOO_MANY_REQUESTS.code).json({
            message:`Too many requests`
        })
    }
}

module.exports =  rateLimitFunction
