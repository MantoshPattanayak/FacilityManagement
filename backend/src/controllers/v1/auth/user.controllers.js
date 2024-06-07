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
            // console.log(isUserExist,'check user')
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
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }
}

let signUp = async (req,res)=>{
 try{
  console.log('1')
  console.log(req.body,'req.body')
    let statusId = 1;
    let {encryptEmail:email, encryptPassword:password,encryptFirstName:firstName,encryptMiddleName:middleName,encryptLastName:lastName,encryptPhoneNo:phoneNo,userImage,encryptLanguage:language,encryptActivity:activities,isEmailVerified} = req.body;

    if(activities){
      activities = activities.map(decryptValue=>decrypt(decryptValue));
    }

    console.log(activities,"activities")

    console.log('req.body',req.body)
    let createdDt = new Date();
    let updatedDt = new Date();
    if(!password && !firstName && !middleName && !lastName && !phoneNo && !userImage && !activities && language){
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: `please provide all required data to set up the profile`
      })
    }
    if(email){
      if(isEmailVerified != 1){
        return res.status(statusCode.BAD_REQUEST.code).json({
          message: `Please verify the email first`
        })
      }
      
    }
    // const decryptUserName = decrypt(userName);
    // const decryptEmailId = decrypt(email);
    // const decryptPhoneNumber = decrypt(phoneNo);
 
    password = decrypt(password)

    let checkDuplicateMobile= await user.findOne({
        where:
        {
         [Op.and]:[
          {phoneNo:phoneNo},
          {statusId:statusId}
        ]
          
        }
      })


      console.log('password check',phoneNo)

      if(checkDuplicateMobile){
        return res.status(statusCode.CONFLICT.code).json({
          message:"This mobile is already allocated to existing user"
        })
      }

      console.log(checkDuplicateMobile,'check duplicate mobile')

      
      let lastLogin = new Date();
  

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // for uploading user image
      



      const newUser = await user.create({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        userName: email,
        password: hashedPassword,
        phoneNo: phoneNo,
        emailId: email,
        language:language,
        lastLogin:lastLogin, // Example of setting a default value
        statusId: 1, // Example of setting a default value
        createdDt: createdDt, // Set current timestamp for createdOn
        updatedDt: updatedDt, // Set current timestamp for updatedOn
     
      });

      if(!newUser){
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
          }
        }
      )
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

        })
      }) 
      }
   
      
      // after the user created successfully then the image can be added 
      if(userImage){
        let userImagePath = null;
        let userImagePath2 = null;

        let uploadDir = process.env.UPLOAD_DIR;
        let base64UploadUserImage = userImage ? userImage.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, ""): null;
        let mimeMatch = userImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/)
        let mime = mimeMatch ? mimeMatch[1]: null;
        if([
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(mime)){
          // convert base 64 to buffer 
          let uploadImageBuffer = userImage ? Buffer.from(base64UploadUserImage,'base64') : null;
          if(uploadImageBuffer){
            const userImageDir = path.join(uploadDir,"userImageDir");
            if(!fs.existsSync(userImageDir)){
              fs.mkdirSync(userImageDir,{recursive:true})
            }
            let fileExtension = mime ? mime.split("/")[1] : "txt";
            userImagePath = `${uploadDir}/userImageDir/${newUser.userId}.${fileExtension}`
            fs.writeFileSync(userImagePath, uploadImageBuffer);
            userImagePath2= `/userImageDir/${userName}.${fileExtension}`
            let fileName = `${newUser.userName}${newUser.userId}.${fileExtension}`
            let fileType = mime ? mime.split("/")[0]:'unknown'
            // insert to file table and file attachment table
            let createFile = await file.create({
              fileName:fileName,
              fileType:fileType,
              url:userImagePath2,
              statusId:1,
              createdDt:now(),
              updatedDt:now()
            })
  
            if(!createFile){
              return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:err.message})
            }
            let createFileAttachment = await fileAttachment.create({
              entityId: newUser.userId,
              entityType:'usermaster',
              fileId:createFile.fileId,
              statusId:1,
              filePurpose:"User Image"
            })
          }
        }
        else{
          return res.status(statusCode.BAD_REQUEST.code).json({message:"Invalid File type for the event image"})
        }
      }

      // Return success response
      return res.status(statusCode.SUCCESS.code).json({
        message:"User created successfully", user: newUser 
      })

  } catch (err) {
    // Handle errors
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
    let mobileNo = decrypt(isUserExist.phoneNo)
    console.log(isUserExist.userId,userName,emailId,mobileNo)

    console.log(userId,userName,emailId,mobileNo,'mobileNo')

    let accessAndRefreshToken = await generateToken(userId,userName,emailId,mobileNo)

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
        .json({ message: 'logged in', username: isUserExist.userName, fullname: isUserExist.fullName, email: isUserExist.emailId, role: isUserExist.roleId, accessToken: accessToken, refreshToken:refreshToken,  }); //menuItems: dataJSON
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
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message, sessionExpired: true });

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
 forgotPassword

}

