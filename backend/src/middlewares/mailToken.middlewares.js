let jwt = require('jsonwebtoken');


async function mailToken({firstField, secondField}){
    const user = {firstField,secondField};

    console.log('user data',user)
    const token = jwt.sign(user,process.env.EMAIL_TOKEN,{expiresIn:'10m'})
    return token;

}


module.exports = mailToken;