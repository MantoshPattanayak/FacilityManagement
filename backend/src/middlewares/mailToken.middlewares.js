let jwt = require('jsonwebtoken');


async function mailToken({firstField, secondField,thirdField}){
    const user = {firstField,secondField,thirdField};

    console.log('user data',user)
    const token = jwt.sign(user,process.env.EMAIL_TOKEN,{expiresIn:'10m'})
    return token;

}


module.exports = mailToken;