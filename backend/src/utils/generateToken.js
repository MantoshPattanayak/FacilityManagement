let jwt = require('jsonwebtoken');
let {encrypt}= require('../middlewares/encryption.middlewares')
let {decrypt}= require('../middlewares/encryption.middlewares')

//Generate an access token and a refresh token for this database user
async function jwtTokens(userId, userName, emailId,roleId ) {
  try{
  console.log(userId, userName,emailId,'token data')

  const user = { userId, userName, emailId,roleId};
  console.log(userId, userName, emailId,roleId);


    let accessToken;
    let refreshToken;

    accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10day' });
    refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10day' });
  
  
  return ({ accessToken, refreshToken });
}

catch (err) {
return {
  error:"Internal Server Error"
}
} 
}

module.exports = jwtTokens;


