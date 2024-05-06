var nodemailer = require('nodemailer')

const sendMail = async(option)=>{
    // Here the transporter allows to send the mail to other mail ids 
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.mailUsername,
            pass:process.env.mailPassword
        }
    })
    const mailOptions ={
        from:process.env.mailUsername,
        to:option(mail),
        subject:'Verify your email address',
        text:'write mobile number'
    }
    await transporter.sendMail(mailOptions)

}

module.exports = sendMail


