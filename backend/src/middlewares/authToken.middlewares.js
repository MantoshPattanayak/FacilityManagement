let jwt = require('jsonwebtoken');
let statusCode = require('../utils/statusCode.js');
const db = require("../models/index.js");
const User = db.usermaster;
let authSessions = db.authsessions;
let {Op}= require('sequelize')
let encrypt = require('./encryption.middlewares.js')
let decrypt = require('./decryption.middlewares.js')
function authenticateToken(req, res, next) {
  try {
    console.log('new date', new Date())
    const authHeader = req.headers['authorization']; 
    const tokens = req.cookies;
    const sessionId = req.headers['sid']
    let statusId = 1;

    console.log(authHeader,'authHeaders and tokens',tokens)
    const token = tokens?.accessToken || authHeader?.replace('Bearer', '').trim();

    console.log(token,'token')
    if (token == null) return res.status(statusCode.UNAUTHORIZED.code).json({ error: "Null token" });

    if (!token) {
      return res.status(statusCode.UNAUTHORIZED.code).json({ error: "Access token not found" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
      // console.log(user);
      if (error) return res.status(statusCode.UNAUTHORIZED.code).json({ error: error.message });
      console.log(user,'user')
      const findUser = await User.findByPk(user.userId);
      console.log(findUser,'findUser')

    
      // console.log(query.rows);
      if (findUser.statusId == 0) {
        return res.status(statusCode.UNAUTHORIZED.code).json({ message: 'You are inactive user' });
      } else {
        let checkIfTheSessionIsActiveOrNot = await authSessions.findOne({
          where:{
            [Op.and]:[{active:statusId},{sessionId:decrypt(sessionId)}]
          }
        })
        if(!checkIfTheSessionIsActiveOrNot){
          return res.status(statusCode.UNAUTHORIZED.code).json({
            message:"One session is already in active mode"
          })
        }
        req.user = findUser;
        req.session = sessionId;
        next();
      }
    });
  } catch (err) {
    return res.status(statusCode.UNAUTHORIZED.code).json({ message: err.message });
  }
}


module.exports = authenticateToken;