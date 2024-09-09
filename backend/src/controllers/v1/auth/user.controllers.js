const db = require("../../../models/index");
let statusCode = require("../../../utils/statusCode");
const bcrypt = require("bcrypt");
const user = db.usermaster;
const fs = require('fs')
let authSessions = db.authsessions
let deviceLogin = db.device
let otpCheck = db.otpDetails
let QueryTypes = db.QueryTypes
let userActivityPreference = db.userActivityPreference
let imageUpload = require('../../../utils/imageUpload')
// const admin = require('firebase-admin');
const { sequelize,Sequelize } = require('../../../models')
let jwt = require('jsonwebtoken');

const {encrypt} = require('../../../middlewares/encryption.middlewares')
const {decrypt} = require('../../../middlewares/decryption.middlewares')
const {generateOTP,verify1OTP} = require('../../../utils/mobileOtpGenerateAndVerify')

const passport = require('passport')
require('../../../config/passport')
const mailToken= require('../../../middlewares/mailToken.middlewares')

const { Op } = require("sequelize");
const sendEmail = require('../../../utils/generateEmail')
const logger = require('../../../logger/index.logger')

// Initialize Firebase Admin SDK
// var serviceAccount = require("D:/AmaBhoomiProject/amabhoomi-25a8a-firebase-adminsdk-ggc8d-a61a7fdad5.json");


// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// let generateOTPHandler = async (req,res)=> {
//   try {
//     let {mobileNo} = req.body

//       const response = await generateOTP(mobileNo);

//       // Check if the response indicates success
//       if (response && response.status === 'OK') {
//           // OTP generated successfully
//           return res.status(statusCode.SUCCESS.code).json({
//             message: 'otp generated successfully'
//           })
//       } else {
//           // OTP generation failed
//           return res.status(statusCode.BAD_REQUEST.code).json({
//             message: 'Failed to generate OTP. Please try again later.'
//           })
//       }
//   } catch (error) {
//       console.error('Error generating OTP:', error);
//       // Handle error
//       return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
//         message: 'Error generating OTP. Please try again later.'
//       })
//   }
// }


let generateToken = require('../../../utils/generateToken');

// this will work for both user and admin for generate otp handler

let generateOTPHandler = async (req,res)=> {
  try {
    console.log('1',req.body)

    let {encryptMobile:mobileNo}=req.body
    let length=6
    let numberValue = '1234567890'
    let expiryTime = new Date();
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
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:"Something went wrong"
          })
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
      return res.status(statusCode.SUCCESS.code).json({
        message: 'otp generated successfully', otp:otp
 })
    }
    else{
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: 'otp generation failed'
 })
    }

    }
    else{
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: 'please provide the mobile no'
 })
    }
      
  } catch (error) {
      console.error('Error generating OTP:', error);
      logger.error(`An error occurred: ${error.message}`); // Log the error

      // Handle error
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: 'Error generating OTP. Please try again later.'
      })
  }
}
// let verifyOTPHandlerWithGenerateToken = async (mobileNo,otp)=>{
//   try {
//       // Call the API to verify OTP
//       const response = await verifyOTP(mobileNo, otp); // Replace with your OTP verification API call

//       // Check if OTP verification was successful
//       if (response && response.status === 'OK') {
//           // OTP verified successfully
//           // Check if the user exists in the database
//           let isUserExist = await user.findOne({
//             where:{
//               contactNo:mobileNo
//             }
//           })
//         // If the user does not exist then we have to send a message to the frontend so that the sign up page will get render
//         if(!isUserExist){
//          return{
//           error:'Please render the signup page'
//          }
//         }
//           // Return the generated tokens
//           return null;  
//       } else {
//           // OTP verification failed
//           return{
//             error:'OTP verification failed'
//           }      
//         }
//   } catch (err) {
//     return{
//       error:`Error verifying OTP :${err}`
//     }
//   }
// }

let verifyOTPHandlerWithGenerateToken = async (req,res)=>{
  try {
      // Call the API to verify OTP
      // const response = await verifyOTP(mobileNo, otp); // Replace with your OTP verification API call

      // Check if OTP verification was successful
      console.log(1,req.body)
      let roleId = 4;
      let statusId = 1;
      let {encryptMobile:mobileNo,encryptOtp:otp}=req.body

      let userAgent =  req.headers['user-agent'];

      console.log('userAgent', userAgent)
      let deviceInfo = parseUserAgent(userAgent)
      let lastLoginTime = new Date();


      if (mobileNo && otp) {
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
            
            console.log(updateTheVerifiedValue,'update the verified value')
             // Check if the user exists in the database
             let isUserExist = await user.findOne({
              where:{
               [Op.and]:[{ phoneNo:mobileNo},{statusId:statusId},{roleId:roleId}]
              }
            })
            console.log(isUserExist,'check user 223 line')
          // If the user does not exist then we have to send a message to the frontend so that the sign up page will get render
          if(!isUserExist){

            return res.status(statusCode.SUCCESS.code).json({message:"please render the sign up page",decideSignUpOrLogin:0});  

          }
          
          console.log('2')
          let tokenGenerationAndSessionStatus = await tokenAndSessionCreation(isUserExist,lastLoginTime,deviceInfo);

          console.log('all the data', tokenGenerationAndSessionStatus)

          if(tokenGenerationAndSessionStatus?.error){

            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
              message:tokenAndSessionCreation.error
            })

          }

          console.log('here upto it is coming')
          let {accessToken, refreshToken, options,sessionId} = tokenGenerationAndSessionStatus
                  //menu items list fetch
        //     let menuListItemQuery = `select rr.resourceId, rm.name,rr.parentResourceId,rm.orderIn, rm.path from publicuser pu inner join roleresource rr on rr.roleId = pu.roleId
        //     inner join resourcemaster rm on rm.resourceId = rr.resourceId and rr.statusId =1 
        //     where pu.publicUserId = :userId and rr.statusId =1 and rm.statusId =1 
        //     order by rm.orderIn`

        //     let menuListItems = await sequelize.query(menuListItemQuery,{
        //       replacements:{
        //         userId:isUserExist.userId
        //       },
        //       type: QueryTypes.SELECT
        //     })
 

        // let dataJSON = new Array();
        // //create parent data json without child data 
        // for (let i = 0; i < menuListItems.length; i++) {
        //     if (menuListItems[i].parentResourceId === null) {
        //         dataJSON.push({
        //             id: menuListItems[i].resourceId,
        //             name: menuListItems[i].name,
        //             orderIn: menuListItems[i].orderIn,
        //             path: menuListItems[i].path,
        //             children: new Array()
        //         })
        //     }
        // }
        
        // Set the access token in an HTTP-only cookie named 'accessToken'
        res.cookie('accessToken', accessToken,options);

        // Set the refresh token in a separate HTTP-only cookie named 'refreshToken'
        res.cookie('refreshToken', refreshToken, options)

        // bearer is actually set in the first to tell that  this token is used for the authentication purposes

        return res.status(statusCode.SUCCESS.code)
        .header('Authorization', `Bearer ${accessToken}`)
        .json({ message: "please render the login page", username: isUserExist.userName, fullname: isUserExist.fullName, email: isUserExist.emailId, role: isUserExist.roleId, accessToken: accessToken, refreshToken:refreshToken, decideSignUpOrLogin:1,sid:sessionId });

        }
        else{
          return res.status(statusCode.BAD_REQUEST.code).json({
            message:"Invalid Otp"
          })
        }
       
          // Return the generated tokens
      } else {
          // OTP verification failed
          return res.status(statusCode.BAD_REQUEST.code).json({message:'Please provide the mobileNo and otp'});   
        }
  } catch (err) {
      logger.error(`An error occurred: ${err.message}`); // Log the error

      return res.status(statusCode.BAD_REQUEST.code).json({message:err.message}); 
 
   
  }
}


let sendEmailToUser = async(req,res)=>{
  try {
    let {emailId,mobileNo,changePassword,roleId}= req.body
    emailId = decrypt(emailId)
    let message;
    if(mobileNo){
      mobileNo = decrypt(mobileNo)
    }
    console.log(emailId,mobileNo,"req.body")
    let firstField = emailId;
    let secondField = mobileNo;
    let thirdField = roleId;
    let Token = await mailToken({firstField,secondField,thirdField})
    let verifyUrl = process.env.VERIFY_URL+`?token=${Token}`

    if(changePassword==1){
      message = `
      <b>This is your emailId <b>${emailId}</b><br>
      Please use the below link to change your password</br></br><a href=${verifyUrl}>
      <button style=" background-color: #4CAF50; border: none;
       color: white;
       padding: 15px 32px;
       text-align: center;
       text-decoration: none;
       display: inline-block;
       font-size: 16px;">Update Password</button> </a>
       </br></br>
       This link is valid for 10 mins only  `
    }
    else{
      message = `Please verify your emailId.<br><br>
      This is your emailId <b>${emailId}</b><br>
      Please use the below link to verify the email address</br></br><a href=${verifyUrl}>
      <button style=" background-color: #4CAF50; border: none;
       color: white;
       padding: 15px 32px;
       text-align: center;
       text-decoration: none;
       display: inline-block;
       font-size: 16px;">Verify Email</button> </a>
       </br></br>
       This link is valid for 10 mins only  `;
    }
   
      try {
          await sendEmail({
            email:`${emailId}`,
            subject:"please verify the email for your amabhoomi sign up",
            html:`<p>${message}</p>`
          }
          )

          return res.status(statusCode.SUCCESS.code).json({message:`email is sent`})
      } catch (err) {
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:err.message})
      }
    
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`); // Log the error
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }
}

let verifyEmail = async(req,res)=>{
  try {
    let {token}= req.body;
    console.log('req.body',req.body)
    let isEmailVerified =1
    let statusId = 1;
    console.log('token',token);
    if(!token){
      return res.status(statusCode.NOTFOUND.code).json({
        message:"Bad Request"
      })
    }

    const decodedEmailToken = jwt.verify(token,process.env.EMAIL_TOKEN,{ignoreExpiration: true})
    if(decodedEmailToken){
      const {exp , iat}= decodedEmailToken
      
      // Calculate the duration of the token's validity in seconds
      const durationInSeconds = exp - iat;
      let mobileNo =  encrypt(decodedEmailToken.secondField)
      let roleId = decodedEmailToken.roleId

      if (exp * 1000 <= Date.now()) {
        console.log('Token has expired');
        return res.status(statusCode.BAD_REQUEST.code).json({ message: 'Url Expired' });
      }
      else{
        // update the verify email column in database to verfied i.e. 1
       
       let userExist = await user.findOne({
        where:{
          [Op.and]:[{phoneNo:mobileNo},{statusId:statusId}]
        }
       })

       console.log(userExist,'userExist')
        if(userExist){
          let [updateVerifyEmailColumn] = await user.update({
            verifyEmail:isEmailVerified
          },
        {
          where:{
            [Op.and]:[{phoneNo:mobileNo},{roleId:userExist.roleId}]
        }})
        if(updateVerifyEmailColumn==0 && userExist.verifyEmail == 0){
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:`Something went wrong`
          })
        }
        return res.status(statusCode.SUCCESS.code).json({
          message:`Email verified Successfully`,isEmailVerified:isEmailVerified
        })

        }
        return res.status(statusCode.SUCCESS.code).json({
          message:`Email verified Successfully`,isEmailVerified:isEmailVerified
        })
      }
    }
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`); // Log the error

    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }
}

let forgotPassword = async(req,res)=>{
  try {
    console.log('1232')
    let {mobileNo,password}= req.body;
    console.log('req.body',req.body)
    let statusId = 1;
    // console.log('token',token);
    let publicRole = null;
    // if(!token){
    //   return res.status(statusCode.NOTFOUND.code).json({
    //     message:"Bad Request"
    //   })
    // }
    if(!mobileNo && !password){
      return res.status(statusCode.BAD_REQUEST.code).json({
      message:"Bad Request"
      })
    }
    mobileNo= encrypt(mobileNo)
    // password = decrypt(password)
    const hashedPassword = await bcrypt.hash(password, 10);

    // const decodedEmailToken = jwt.verify(token,process.env.EMAIL_TOKEN,{ignoreExpiration: true})
    // if(decodedEmailToken){
    //   const {exp , iat}= decodedEmailToken
      
    //   // Calculate the duration of the token's validity in seconds
    //   const durationInSeconds = exp - iat;
    //   let emailId =  encrypt(decodedEmailToken.firstField)
    //   if (exp * 1000 <= Date.now()) {
    //     console.log('Token has expired');
    //     return res.status(statusCode.BAD_REQUEST.code).json({ message: 'Url Expired' });
    //   }
      // else{
        // update the password
       
       let userExist = await user.findOne({
        where:{
          [Op.and]:[{phoneNo:mobileNo},{statusId:statusId},{roleId:publicRole}]
        }
       })

       console.log(userExist,'userExist')
        if(userExist){
          let [updatePassword] = await user.update({
            password:hashedPassword
          },
        {
          where:{
            [Op.and]:[{userId:userExist.userId}]
        }})
        if(updatePassword==0){
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:`Something went wrong`
          })
        }
        return res.status(statusCode.SUCCESS.code).json({
          message:`Password changed successfully`
        })

        }
        return res.status(statusCode.BAD_REQUEST.code).json({
          message:`User does not exist. Please check the email address`,
        })
      // }
    // }
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`); // Log the error

    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }
}

let signUp = async (req,res)=>{
  let transaction;
 try{
  transaction = await sequelize.transaction();
  console.log('1')
  let roleId = 4; //user roleId
  console.log(req.body,'req.body')
    let statusId = 1;
    let {encryptEmail:email, encryptPassword:password,encryptFirstName:firstName,
      encryptMiddleName:middleName,encryptLastName:lastName,
      encryptPhoneNo:phoneNo,userImage,encryptLanguage:language,
      encryptActivity:activities,isEmailVerified, location} = req.body;

    // if(activities){
    //   activities = activities.map(decryptValue=>decrypt(decryptValue));
    // }
    console.log(activities,"activities")

    console.log('req.body',req.body)
    let createdDt = new Date();
    let updatedDt = new Date();
    if(!firstName && !lastName && !phoneNo && !userImage && !activities && !language){
      await transaction.rollback();
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: `please provide all required data to set up the profile`
      })
    }
    if(email){
      if(isEmailVerified != 1){
        await transaction.rollback();
        return res.status(statusCode.BAD_REQUEST.code).json({
          message: `Please verify the email first`
        })
      }
      
    }
    // const decryptUserName = decrypt(userName);
    // const decryptEmailId = decrypt(email);
    // const decryptPhoneNumber = decrypt(phoneNo);
 
    // password = decrypt(password)

    let checkDuplicateMobile= await user.findOne({
        where:
        {
         [Op.and]:[
          {phoneNo:phoneNo},
          {statusId:statusId}
        ]
          
        },
        transaction
      })


      console.log('password check',phoneNo)

      if(checkDuplicateMobile){
        await transaction.rollback();
        return res.status(statusCode.CONFLICT.code).json({
          message:"This mobile is already allocated to existing user"
        })
      }

      console.log(checkDuplicateMobile,'check duplicate mobile')

      
      let lastLogin = new Date();
  

      // Hash the password
      // const hashedPassword = await bcrypt.hash(password, 10);
      // for uploading user image
      



      const newUser = await user.create({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        userName: email,
        // password: hashedPassword,
        phoneNo: phoneNo,
        emailId: email,
        roleId:roleId,
        language:language,
        location:location,
        lastLogin:lastLogin, // Example of setting a default value
        statusId: 1, // Example of setting a default value
        createdDt: createdDt, // Set current timestamp for createdOn
        updatedDt: updatedDt, // Set current timestamp for updatedOn
     
      },
    {
      transaction
    });

      if(!newUser){
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:"Something went wrong"
        })
      }
      if(isEmailVerified==1){
        let [updateTheUser] = await user.update({
          verifyEmail:isEmailVerified
        },{
          where:{
            userId:newUser.userId
          },
          transaction
        }
      )
      if(updateTheUser==0){
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:`Something went wrong`
        })
      }
      console.log(updateTheUser,'update the user email ')
      }
      if(activities){
           // insert to prefered activity first
        activities.forEach(async(activity)=>{
          let insertToPreferedActivity  = await userActivityPreference.create({
            userId:newUser.userId,
            userActivityId: activity,
            statusId:statusId,
            createdBy:newUser.userId,
            updatedBy:newUser.userId,
            createdDt:createdDt,
            updatedDt:updatedDt

          },
        {
          transaction
        })

        if(!insertToPreferedActivity){
          await transaction.rollback();
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:`Something went wrong`
          })
        }
        }) 
      }
   
      
      // after the user created successfully then the image can be added 
      if(userImage){
        let insertionData = {
          id:newUser.userId,
          name:decrypt(firstName)
         }
        // create the data
        let entityType = 'usermaster'
        let errors = [];
        let subDir = "userDir"
        let filePurpose = "User Image"
        let uploadSingleImage = await imageUpload(userImage,entityType,subDir,filePurpose,insertionData,newUser.userId,errors,1,transaction)
        console.log( uploadSingleImage,'165 line facility image')
        if(errors.length>0){
          await transaction.rollback();
          if(errors.some(error => error.includes("something went wrong"))){
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
          }
          return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
        }
       
      }
      if(newUser){
        await transaction.commit();
      // Return success response
      return res.status(statusCode.SUCCESS.code).json({
        message:"User created successfully", user: newUser 
      })
      }
      else{
         await transaction.rollback();
        return res.status(statusCode.BAD_REQUEST.code).json({
          message:`Data is not updated`
        })
      }

    

  } catch (err) {
    // Handle errors

    if(transaction) await transaction.rollback();
    logger.error(`An error occurred: ${err.message}`); // Log the error
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }
};

function parseUserAgent(userAgent) {
  let deviceType = 'Unknown';
  let deviceName = 'Unknown Device';

  // Check if the User-Agent string contains patterns indicative of specific device types
  if (userAgent.includes('Windows')) {
      deviceType = 'Desktop';
      deviceName = 'Windows PC';
  } else if (userAgent.includes('Macintosh')) {
      deviceType = 'Desktop';
      deviceName = 'Mac';
  } else if (userAgent.includes('Linux')) {
      deviceType = 'Desktop';
      deviceName = 'Linux PC';
  } else if (userAgent.includes('Android')) {
      deviceType = 'Mobile';
      deviceName = 'Android Device';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod')) {
      deviceType = 'Mobile';
      deviceName = 'iOS Device';
  }
    else if(userAgent.includes('Postman')){
      deviceType = 'PC'
      deviceName = 'Postman'
      
    }

  return { deviceType, deviceName };
}

let tokenAndSessionCreation = async(isUserExist,lastLoginTime,deviceInfo)=>{
  try {
    let userName =  decrypt(isUserExist.userName)
    let emailId
    let sessionId;
    
    if(isUserExist.emailId!=null){
      emailId =  decrypt(isUserExist.emailId)

    }
  
    let userId = isUserExist.userId
    let roleId = isUserExist.roleId
    console.log(isUserExist.userId,userName,emailId)

    console.log(userId,userName,emailId,roleId,'roleId')

    let accessAndRefreshToken = await generateToken(userId,userName,emailId,roleId)

    console.log(accessAndRefreshToken, "accessAndRefreshToken")
    if(accessAndRefreshToken?.error){
      return {
        error:accessAndRefreshToken.error
      }
    }
    let {accessToken,refreshToken} = accessAndRefreshToken;

    console.log(accessToken, refreshToken, 'accessToken and refresh token')
    const options = {
      httpOnly: true,
      secure: true
    };

    let updateLastLoginTime =  await user.update({lastLogin:lastLoginTime},{
      where :{
        userId:isUserExist.userId
      }
    })
    // check for active session

    let checkForActiveSession = await authSessions.findOne({where:{
    [Op.and] :[{userId:isUserExist.userId},
      {active:1}]
    }})
    // if active
    if(checkForActiveSession){

      let updateTheSessionToInactive = await authSessions.update({active:2},{
        where:{
          sessionId:checkForActiveSession.sessionId}
      })
      console.log('update the session To inactive', updateTheSessionToInactive)
        // after inactive
        if(updateTheSessionToInactive.length>0){
          // check if it is present in the device table or not
          let checkDeviceForParticularSession = await deviceLogin.findOne({
            where:{
              sessionId:checkForActiveSession.sessionId
            }
          })
          if(checkDeviceForParticularSession){
            if(checkDeviceForParticularSession.deviceName==deviceInfo.deviceName && checkDeviceForParticularSession.deviceType == deviceInfo.deviceType ){
              // insert to session table first 
              let insertToAuthSession = await authSessions.create({
                lastActivity:new Date(),
                active:1,
                deviceId:checkDeviceForParticularSession.deviceId,
                userId:isUserExist.userId
              })
              // then update the session id in the device table
              let updateTheDeviceTable = await deviceLogin.update({
                sessionId:insertToAuthSession.sessionId
              },{
                where:{
                  deviceId:checkDeviceForParticularSession.deviceId
                }
              })
              sessionId = insertToAuthSession.sessionId
            }
            else{
              // insert to device table 
              let insertToDeviceTable = await deviceLogin.create({
                deviceType:deviceInfo.deviceType,
                deviceName:deviceInfo.deviceName,
              
              })

              // Insert to session table
              let insertToAuthSession = await authSessions.create({
                lastActivity:new Date(),
                active:1,
                deviceId:insertToDeviceTable.deviceId,
                userId:isUserExist.userId
              })
              // update the session id in the device table
              let updateSessionIdInDeviceTable = await deviceLogin.update({
                sessionId:insertToAuthSession.sessionId
              },{
                where:{
                  deviceId:insertToDeviceTable.deviceId
                }
              })

              sessionId = insertToAuthSession.sessionId
            }
            console.log('session id ', sessionId)
          }
          else{
            console.log('session id2 ', sessionId)

              // insert to device table 
              let insertToDeviceTable = await deviceLogin.create({
                deviceType:deviceInfo.deviceType,
                deviceName:deviceInfo.deviceName,
              
              })

              // Insert to session table
              let insertToAuthSession = await authSessions.create({
                lastActivity:new Date(),
                active:1,
                deviceId:insertToDeviceTable.deviceId,
                userId:isUserExist.userId
              })
              // update the session id in the device table
              let updateSessionIdInDeviceTable = await deviceLogin.update({
                sessionId:insertToAuthSession.sessionId
              },{
                where:{
                  deviceId:insertToDeviceTable.deviceId
                }
              })
              sessionId = insertToAuthSession.sessionId

          }
          console.log('session 3',sessionId)
        }
        else{
          console.log('session 4',sessionId)

          return {
            error:'Something Went Wrong'
          }

        }
      
     
    }
    else{
        // insert to device table 
        let insertToDeviceTable = await deviceLogin.create({
          deviceType:deviceInfo.deviceType,
          deviceName:deviceInfo.deviceName,
        
        })

        // Insert to session table
        let insertToAuthSession = await authSessions.create({
          lastActivity:new Date(),
          active:1,
          deviceId:insertToDeviceTable.deviceId,
          userId:isUserExist.userId
        })
        // update the session id in the device table
        let updateSessionIdInDeviceTable = await deviceLogin.update({
          sessionId:insertToAuthSession.sessionId
        },{
          where:{
            deviceId:insertToDeviceTable.deviceId
          }
        })
        sessionId = insertToAuthSession.sessionId
    }
    console.log('session id5', encrypt(sessionId), sessionId)
    return {
      accessToken:accessToken,
      refreshToken:refreshToken,
      sessionId:encrypt(sessionId),
      options:options
    }

  } catch (err) {
    return {
      error:'Something Went Wrong'
    }
  }
}

let publicLogin = async(req,res)=>{

  try{
    console.log("here Response", req.body)

    let {encryptMobile:mobileNo,encryptEmail:emailId,encryptPassword:password}= req.body
    let statusId = 1
    let userAgent =  req.headers['user-agent'];

    let deviceInfo = parseUserAgent(userAgent)
    

    console.log(req.body,'req.body')
    let lastLoginTime = new Date();

    if(emailId && password || mobileNo && password)
    {
      console.log('f')
      let isUserExist;
      
      if(emailId){
        // emailId= await decrypt(emailId)
        // check whether the credentials are valid or not 
        // Finding one record
       isUserExist = await user.findOne({
        where: {
          [Op.and]:[{emailId:emailId},{statusId:statusId}]
        }
        })


        console.log('fj')
      }
      if(mobileNo){
        console.log('mobileNo',mobileNo)
        // mobileNo = await decrypt(mobileNo)
        // check whether the credentials are valid or not 
        // Finding one record
        
      isUserExist = await user.findOne({
        where: {
          [Op.and]:[{phoneNo:mobileNo},{statusId:statusId}]
        }
        })

        console.log('2 mobile no', isUserExist, 'phoneNumber',mobileNo)
      }

      
   

      password = decrypt(password)
    
      
        if(isUserExist){
          console.log('isUserExist', isUserExist)
          if(isUserExist?.roleId!=4){
            return res.status(statusCode.BAD_REQUEST.code).json({
              message:"Please do login using your user credential"
            })
          }
          // console.log('21',isUserExist)
          const isPasswordSame = await bcrypt.compare(password, isUserExist.password);
          if(isPasswordSame){
            console.log('isUserExist.userId,isUserExist.userName, isUserExist.emailId',isUserExist.userId, isUserExist.userName, isUserExist.emailId)


            let tokenGenerationAndSessionStatus = await tokenAndSessionCreation(isUserExist,lastLoginTime,deviceInfo);
            if(tokenGenerationAndSessionStatus?.error){

              return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:tokenAndSessionCreation.error
              })

            }
            console.log('fdfjdlkfld')
            let {accessToken, refreshToken, options,sessionId} = tokenGenerationAndSessionStatus
          
            //menu items list fetch
        //     let menuListItemQuery = `select rr.resourceId, rm.name,rr.parentResourceId,rm.orderIn, rm.path from publicuser pu inner join roleresource rr on rr.roleId = pu.roleId
        //     inner join resourcemaster rm on rm.resourceId = rr.resourceId and rr.statusId =1 
        //     where pu.publicUserId = :userId and rr.statusId =1 and rm.statusId =1 
        //     order by rm.orderIn`

        //     let menuListItems = await sequelize.query(menuListItemQuery,{
        //       replacements:{
        //         userId:isUserExist.userId
        //       },
        //       type: QueryTypes.SELECT
        //     })
 

        // let dataJSON = new Array();
        // //create parent data json without child data 
        // for (let i = 0; i < menuListItems.length; i++) {
        //     if (menuListItems[i].parentResourceId === null) {
        //         dataJSON.push({
        //             id: menuListItems[i].resourceId,
        //             name: menuListItems[i].name,
        //             orderIn: menuListItems[i].orderIn,
        //             path: menuListItems[i].path,
        //             children: new Array()
        //         })
        //     }
        // }
        
        // Set the access token in an HTTP-only cookie named 'accessToken'
        res.cookie('accessToken', accessToken,options);

        // Set the refresh token in a separate HTTP-only cookie named 'refreshToken'
        res.cookie('refreshToken', refreshToken, options)

        // bearer is actually set in the first to tell that  this token is used for the authentication purposes
          
        console.log('233232')
        return res.status(statusCode.SUCCESS.code)
        .header('Authorization', `Bearer ${accessToken}`)
        .json({ message: 'logged in', userId:isUserExist.userId, username: isUserExist.userName, fullname: isUserExist.fullName, email: isUserExist.emailId, role: isUserExist.roleId, accessToken: accessToken, refreshToken:refreshToken,
          sid:sessionId
          }); //menuItems: dataJSON
          }

          else{
            return res.status(statusCode.BAD_REQUEST.code).json({
              message:"Invalid Password"
            })
          }
        }
        else{
          return res.status(statusCode.BAD_REQUEST.code).json({
            message:"User does not exist"
          })
        }



   
    }
}
  catch(err){
    logger.error(`An error occurred: ${err.message}`); // Log the error

    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }


}

let privateLogin = async(req,res)=>{
  try{
    console.log("here Response", req.body)

    let {encryptMobile:mobileNo,encryptEmail:emailId,encryptPassword:password}= req.body
    let statusId = 1
    let userAgent =  req.headers['user-agent'];

    let deviceInfo = parseUserAgent(userAgent)

    console.log(req.body,'req.body')
    let lastLoginTime = new Date();

    console.log('fhfha',emailId, 'password', password)
    if(emailId && password || mobileNo && password)
    {
      console.log('f')
      let isUserExist;
      
      if(emailId){
        // emailId= await decrypt(emailId)
        // check whether the credentials are valid or not 
        // Finding one record
       isUserExist = await user.findOne({
        where: {
          [Op.and]:[{emailId:emailId},{statusId:statusId},{verifyEmail:1}]
        }
        })

        console.log(isUserExist,'isUserExist')

        // console.log('fj')
      }
      if(mobileNo){
        console.log('mobileNo12',mobileNo)
        // mobileNo = await decrypt(mobileNo)
        // check whether the credentials are valid or not 
        // Finding one record
        

     
      isUserExist = await user.findOne({
        where: {
          [Op.and]:[{phoneNo:mobileNo},{statusId:statusId},{verifyEmail:1}]
        }
        })
        console.log('isUserExist', isUserExist)

       
        console.log('2 mobile no', isUserExist, 'phoneNumber',mobileNo)
      }
   


        password = decrypt(password)
    
      
        if(isUserExist){

          if(isUserExist.roleId==4){
            return res.status(statusCode.BAD_REQUEST.code).json({message:'Please login through your admin credential'})
          }
  
          // console.log('21',isUserExist)
          const isPasswordSame = await bcrypt.compare(password, isUserExist.password);
          if(isPasswordSame){
            console.log('isUserExist.userId,isUserExist.userName, isUserExist.emailId',isUserExist.userId, isUserExist.userName, isUserExist.emailId)


            let tokenGenerationAndSessionStatus = await tokenAndSessionCreation(isUserExist,lastLoginTime,deviceInfo);
            if(tokenGenerationAndSessionStatus?.error){

              return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:tokenAndSessionCreation.error
              })

            }
            let {accessToken, refreshToken, options} = tokenGenerationAndSessionStatus
          //menu items list fetch
          let menuListItemQuery = 
          `select rr.resourceId, rm.name,rr.parentResourceId,rm.orderIn, rm.path 
            from amabhoomi.usermasters pu 
            inner join amabhoomi.roleresources rr on rr.roleId = pu.roleId
            inner join amabhoomi.resourcemasters rm on rm.resourceId = rr.resourceId and rr.statusId =1 
            where pu.userId = :userId and rr.statusId =1 and rm.statusId =1 
            order by rm.orderIn`;
  
          let menuListItems = await sequelize.query(menuListItemQuery, {
            replacements: {
              userId: isUserExist.userId
            },
            type: QueryTypes.SELECT
          })
  
          console.log('menuListItems', menuListItems);
  
          let dataJSON = new Array();
          //create parent data json without child data 
          for (let i = 0; i < menuListItems.length; i++) {
            if (menuListItems[i].parentResourceId == null) {
              dataJSON.push({
                id: menuListItems[i].resourceId,
                name: menuListItems[i].name,
                orderIn: menuListItems[i].orderIn,
                path: menuListItems[i].path,
                children: new Array()
              })
            }
          }
          console.log('data json ---', dataJSON);
          //push sub menu items data
          for(let i = 0; i < menuListItems.length; i++){
            if(menuListItems[i].parentResourceId !== null){
              let parent = dataJSON.find(item => item.id == menuListItems[i].parentResourceId);
              console.log('parent', parent);
              parent.children.push({
                id: menuListItems[i].resourceId,
                name: menuListItems[i].name,
                orderIn: menuListItems[i].orderIn,
                path: menuListItems[i].path,
              })
            }
          }
  
        // Set the access token in an HTTP-only cookie named 'accessToken'
        res.cookie('accessToken', accessToken,options);

        // Set the refresh token in a separate HTTP-only cookie named 'refreshToken'
        res.cookie('refreshToken', refreshToken, options)

        // bearer is actually set in the first to tell that  this token is used for the authentication purposes

        return res.status(statusCode.SUCCESS.code)
        .header('Authorization', `Bearer ${accessToken}`)
        .json({ message: 'logged in', username: isUserExist.userName, fullname: isUserExist.fullName, email: isUserExist.emailId, role: isUserExist.roleId, accessToken: accessToken, refreshToken:refreshToken, menuItems: dataJSON}); 
          }

          else{
            return res.status(statusCode.BAD_REQUEST.code).json({
              message:"Invalid Password"
            })
          }
        }
        else{
          return res.status(statusCode.BAD_REQUEST.code).json({
            message:"User does not exist"
          })
        }



   
    }
}
  catch(err){
    logger.error(`An error occurred: ${err.message}`); // Log the error

    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }


}

let logout = async (req, res) => {
   try {
    let userId = req.user?.userId || 1; 
    let sessionId = decrypt(req.session)
     const options = {
         expires: new Date(Date.now() - 1), // Expire the cookie immediately
         httpOnly: true,
         secure: true
     };
     let updateTheSessionToInactive = await authSessions.update({active:2},{
      where:{
        sessionId:sessionId}
    })
     // Clear both access token and refresh token cookies
     res.clearCookie('accessToken', options);
     res.clearCookie('refreshToken', options);
 
   res.status(statusCode.SUCCESS.code).json({ message: 'Logged out successfully', sessionExpired: true });
   } catch (err) {
    logger.error(`An error occurred: ${err.message}`); // Log the error

    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message, sessionExpired: true });

   }
}

let adminDashboard = async (req, res) => {
  try {
    let { facilityId } = req.body;
    console.log("first");
    // define all queries
    // query to fetch number of active users in application
    let activeUsersQuery = `
      select u.userId, r.roleId, r.roleCode
      from amabhoomi.usermasters u
      inner join amabhoomi.rolemasters r on u.roleId = r.roleId and u.statusId = 1 and u.roleId = 4
    `;

    // query to fetch count of facility type wise
    let facilitiesQuery = `
      select
        f.facilityTypeId, f2.code as facilityType, count(f.facilityTypeId) as facilitycount
      from amabhoomi.facilities f
      inner join amabhoomi.facilitytypes f2 on f.facilityTypeId = f2.facilitytypeId
      group by f.facilityTypeId
    `;

    // query to fetch bookings count facility wise
    let bookingFacilityQuery = `
      select
        f.facilityId, f3.facilityname, f2.code as facilityType, count(f.facilityId) as bookingscount
      from amabhoomi.facilitybookings f
      inner join amabhoomi.facilities f3 on f3.facilityId = f.facilityId
      inner join amabhoomi.facilitytypes f2 on f.facilityTypeId = f2.facilitytypeId
      group by f.facilityId, f2.code
      order by bookingscount desc
    `;

    // query to fetch no. of active events
    let activeEventQuery = `
      SELECT 
      ea.eventId,
      ea.facilityId,
      ea.eventName, 
      ea.eventCategoryId,
      ea.locationName, 
      ea.eventDate, 
      ea.eventStartTime,
      ea.eventEndTime,
      ea.descriptionOfEvent,
      ea.ticketSalesEnabled,
      ea.ticketPrice,
      ea.eventImagePath,
      ea.additionalFilePath,
      TIME(CONVERT_TZ(CURRENT_TIME(), @@session.time_zone, 'SYSTEM')) as dbTime,
      CASE
      	WHEN CONCAT(ea.eventDate, ' ', ea.eventStartTime) >= CONVERT_TZ(NOW(), @@session.time_zone, 'SYSTEM') 
        THEN 'ACTIVE'
      	ELSE 'CLOSED'
      END AS status
      FROM 
      amabhoomi.eventactivities ea
      WHERE CONCAT(ea.eventDate, ' ', ea.eventStartTime) >= CONVERT_TZ(NOW(), @@session.time_zone, 'SYSTEM')
    `;

    // query to fetch event bookings count event wise and facility wise
    let bookingEventQuery = `
      select
        e.eventId, e2.eventName, f.facilityname, count(e2.eventName) as bookingcount
      from amabhoomi.eventbookings e
      inner join amabhoomi.eventactivities e2 on e.eventId = e2.eventId
      inner join amabhoomi.facilities f on e2.facilityId = f.facilityId
      group by e.eventId, e2.eventName, f.facilityname
      order by bookingcount desc
    `;

    let popularActivitiesQuery = `
      select
        u.userActivityId, u2.userActivityName, count(u.userActivityId) as activityCount
      from amabhoomi.userbookingactivities u
      inner join amabhoomi.useractivitymasters u2 on u.userActivityId = u2.userActivityId
      group by u.userActivityId, u2.userActivityName
      order by activityCount desc
    `;

    // execute queries
    let activeUsersQueryResult = await sequelize.query(activeUsersQuery, {
      type: QueryTypes.SELECT
    });

    let facilitiesQueryResult = await sequelize.query(facilitiesQuery, {
      type:QueryTypes.SELECT
    });

    let bookingFacilityQueryResult = await sequelize.query(bookingFacilityQuery, {
      type: QueryTypes.SELECT
    });

    let activeEventQueryResult = await sequelize.query(activeEventQuery, {
      type: QueryTypes.SELECT
    })

    let bookingEventQueryResult = await sequelize.query(bookingEventQuery, {
      type: QueryTypes.SELECT
    });

    let popularActivitiesQueryResult = await sequelize.query(popularActivitiesQuery, {
      type: QueryTypes.SELECT
    });

    let facilityBookingsQueryResult = ``;

    // facilityId selected, then provide overall booking count monthwise for that facility
    if (facilityId) {
      let facilityBookingsQuery = `
        WITH months AS (
          SELECT DATE_FORMAT(DATE_ADD(CONCAT(YEAR(NOW()), '-01-01'), INTERVAL n.n MONTH), '%Y-%m') AS bookingMonth
          FROM (
            SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
            UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
            UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
          ) AS n
        )
        SELECT
          :facilityId AS facilityId,
          f3.facilityname,
          m.bookingMonth,
          DATE_FORMAT(CONCAT(m.bookingMonth, '-01'), '%M %Y') AS bookingMonthName,
          COALESCE(COUNT(f.facilityId), 0) AS bookingCount
        FROM
          months m
        LEFT JOIN
          amabhoomi.facilitybookings f ON DATE_FORMAT(f.bookingDate, '%Y-%m') = m.bookingMonth AND f.facilityId = :facilityId
        LEFT JOIN
          amabhoomi.facilities f3 ON f3.facilityId = :facilityId
        LEFT JOIN
          amabhoomi.facilitytypes f2 ON f2.facilitytypeId = f.facilityTypeId
        GROUP BY
          m.bookingMonth,
          f3.facilityname
        ORDER BY
          m.bookingMonth
      `;

      facilityBookingsQueryResult = await sequelize.query(facilityBookingsQuery, {
        replacements: {
          facilityId: facilityId
        },
        type: QueryTypes.SELECT
      });
    }
    else {  // if no facility selected, then show booking count of overall facilities month wise
      let facilityBookingsQuery = `
        WITH months AS (
          SELECT DATE_FORMAT(DATE_ADD(CONCAT(YEAR(NOW()), '-01-01'), INTERVAL n.n MONTH), '%Y-%m') AS bookingMonth
          FROM (
            SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
            UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7
            UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
          ) AS n
        )

        SELECT
          @rownum := @rownum + 1 AS serialNumber,
          DATE_FORMAT(CONCAT(m.bookingMonth, '-01'), '%M %Y') AS bookingMonthName,
          COALESCE(COUNT(f.facilityId), 0) AS bookingCount
        FROM
          (SELECT @rownum := 0) r, months m
        LEFT JOIN
          amabhoomi.facilitybookings f ON DATE_FORMAT(f.bookingDate, '%Y-%m') = m.bookingMonth
        LEFT JOIN
          amabhoomi.facilitytypes f2 ON f2.facilitytypeId = f.facilityTypeId
        GROUP BY
          m.bookingMonth
        ORDER BY
          m.bookingMonth
      `;

      facilityBookingsQueryResult = await sequelize.query(facilityBookingsQuery, {
          type: QueryTypes.SELECT
      });
    }

    res.status(statusCode.SUCCESS.code).json({
      message: 'Dashboard information',
      activeUserCount: activeUsersQueryResult.length,
      facilitiesCount: facilitiesQueryResult,
      popularFacilities: bookingFacilityQueryResult,
      popularActivities: popularActivitiesQueryResult,
      activeEventsCount: activeEventQueryResult.length,
      bookingEventData: bookingEventQueryResult,
      specificFacilityBookingData: facilityBookingsQueryResult
    })
  }
  catch(error) {
    logger.error(`An error occurred: ${error.message}`); // Log the error

    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message: error.message});
  }
}



module.exports = {
  signUp,
 publicLogin,
 logout,
 privateLogin,
 generateOTPHandler,
 verifyOTPHandlerWithGenerateToken,
 verifyEmail,
 sendEmailToUser,
 forgotPassword,
 adminDashboard
}

