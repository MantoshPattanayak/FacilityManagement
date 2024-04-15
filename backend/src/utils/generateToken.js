let jwt = require('jsonwebtoken');

//Generate an access token and a refresh token for this database user
async function jwtTokens({ userId, userName, emailId }) {
  try{

  const user = { userId, userName, emailId };
  console.log(userId, userName, emailId);


  let accessToken;
  let refreshToken;

    accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1day' });
    refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10day' });
  
  
  return ({ accessToken, refreshToken });
}

catch (err) {
  return res.status(statusCode.UNAUTHORIZED.code).json({ message: err.message });
} 
}

module.exports = jwtTokens;


