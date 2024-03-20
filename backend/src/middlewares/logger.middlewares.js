const winston = require('winston');


//  creating separate transports for 'info' and 'error' levels 
const infoTransport = new winston.transports.File({
    filename:'../info.log', 
    level:'info'
})


const errorTransport = new winston.transports.File({
    filename:'../error.log',
    level:'error'
})

const logger = winston.createLogger({
    format: winston.format.json(),
    transports:[
        new winston.transports.Console(), //log to the console
        infoTransport, // Log 'info' level messages to info.log
        errorTransport  // Log 'error' level messages to error.log
    ]
})


// Middleware function to log incoming requests
function requestLogger(req, res, next) {
    logger.log('info', `${req.method} ${req.url}`, { timestamp: Date.now() });
    next();
  }
  
  // Middleware function to log errors
  function errorLogger(err, req, res, next) {
    logger.log('error', err.message, { timestamp: Date.now() });
    next(err);
  }

  module.exports = { 
    requestLogger,
     errorLogger
};
