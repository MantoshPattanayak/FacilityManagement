let jwt = require('jsonwebtoken');
let encrypt= require('../middlewares/encryption.middlewares')
let {decrypt}= require('../middlewares/encryption.middlewares')

//Generate an access token and a refresh token for this database user
async function jwtTokens(userId, userName, emailId ) {
  try{
  console.log(userId, userName,emailId,'token data')
  const user = { userId, userName, emailId};
  console.log(userId, userName, emailId);


    let accessToken;
    let refreshToken;

    accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1day' });
    refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10day' });
  
  
  return ({ accessToken, refreshToken });
}

catch (err) {
console.log(err,'error')
} 
}

module.exports = jwtTokens;


