let {encrypt} = require('../middlewares/encryption.middlewares')
const db = require("../models");
let otpCheck = db.otpDetails
let {Op} = require('sequelize')
let generateOtp = async(mobileNo)=>{
    try {
        console.log('generate otp',generateOtp)
        let length=6
        let numberValue = '1234567890'
        let expiryTime = new Date();
        mobileNo = encrypt(mobileNo)
        expiryTime = expiryTime.setMinutes(expiryTime.getMinutes() + 1);
    
        // let otp="";
        // for(let i=0;i<length;i++){
        //   let otpIndex = Math.floor(Math.random()*numberValue.length)
        //   otp += numberValue[otpIndex]
        // }
    
        let otp = "123456"
    
        if(mobileNo){
          // first check if the otp is actually present or not
          let isOtpValid = await otpCheck.findOne({
            where:{
                expiryTime:{[Op.gte]:new Date()},
                mobileNo:mobileNo
            }
          })
          // if present then expire the otp first
          if(isOtpValid){
            let expireTheOtp = await otpCheck.update(
              {
                expiryTime:new Date(Date.now()- 24 * 60 * 60 * 1000)
              },
              {
                where:
                {
                mobileNo:mobileNo
              }
            }
            )
            if(expireTheOtp.length==0){
                return {
                    error: 'otp generation failed'
             }
            }
          }
        // insert to otp verification table
        let insertToOtpTable = await otpCheck.create({
          code:await encrypt(otp),
          expiryTime:expiryTime,
          verified:0,
          mobileNo:mobileNo,
          createdDt:new Date()
        })
        // OTP generated successfully
        if(insertToOtpTable){
          return {
            message: 'otp generated successfully', otp:otp
     }
        }
        else{
          return {
            error: 'otp generation failed'
     }
        }
    
        }
        else{
          return {
            error: 'please provide the mobile no'
     }
        }
          
      } catch (error) {
          console.error('Error generating OTP:', error);
          // Handle error
          return{
            error: 'Error generating OTP. Please try again later.'
          }
      }
}

let verifyOtp = async(mobileNo, otp)=>{
    try {
        
        if (mobileNo && otp) {
            mobileNo = encrypt(mobileNo);
            otp = encrypt(otp)

          // check if the otp is valid or not
          let isOtpValid = await otpCheck.findOne({
            where:{
                expiryTime:{[Op.gte]:new Date()},
                code:otp,
                mobileNo:mobileNo
            }
          })
          console.log('207 line', isOtpValid)
          if(isOtpValid){
              let updateTheVerifiedValue = await otpCheck.update({verified:1}
                ,{
                  where:{
                    id:isOtpValid.id
                  }
                }
              )
            return null;
            } 
            return {
                error: "Invalid Otp"
            }

        }
        return {
            error: "Please provide the mobile number and otp"
        }
    }catch (err) {
        return {
            error:"Something went wrong"
        }
    }
}
module.exports = {
    generateOtp,
    verifyOtp
}