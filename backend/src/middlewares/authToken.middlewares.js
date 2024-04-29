let jwt = require('jsonwebtoken');
let statusCode = require('../utils/statusCode.js');
const db = require('../config/db.js');

function authenticateToken(req, res, next) {

  try {
    const authHeader = req.headers['authorization']; 
    const tokens = req.cookies;
    
    const token = req.cookies?.token?.accessToken || authHeader?.replace('Bearer', '').trim();

    if (token == null) return res.status(statusCode.UNAUTHORIZED.code).json({ error: "Null token" });

    if (!token) {
      return res.status(statusCode.UNAUTHORIZED.code).json({ error: "Access token not found" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
      // console.log(user);
      if (error) return res.status(statusCode.UNAUTHORIZED.code).json({ error: error.message });
      let query = await db.query(`select * from admin.user_master where id= ($1)`, [user.id]);
      // console.log(query.rows);
      if (query.rows[0].status_id == 0) {
        return res.status(statusCode.UNAUTHORIZED.code).json({ message: 'You are inactive user' });
      } else {
        req.user = user;
        next();
      }
    });
  } catch (err) {
    return res.status(statusCode.UNAUTHORIZED.code).json({ message: err.message });
  }
}


module.exports = authenticateToken;