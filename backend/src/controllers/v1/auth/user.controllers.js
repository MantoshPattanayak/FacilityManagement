const db = require("../../../models/index");
let statusCode = require("../../../utils/statusCode");
const bcrypt = require("bcrypt");
const publicUser = db.publicuser;
const privateUser = db.privateuser;
let authSessions = db.authsessions
let deviceLogin = db.device
let otpCheck = db.otpDetails
let QueryTypes = db.QueryTypes
// const admin = require('firebase-admin');
const { sequelize,Sequelize } = require('../../../models')

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

const { request } = require("express");

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

let generateOTPHandler = async (req,res)=> {
  try {
    console.log('1',req.body)

    let {encryptMobile:mobileNo}=req.body
    let length=4
    let numberValue = '1234567890'
    let expiryTime = new Date();
    expiryTime = expiryTime.setMinutes(expiryTime.getMinutes() + 5);

    let otp="";
    for(let i=0;i<length;i++){
      let otpIndex = Math.floor(Math.random()*numberValue.length)
      otp += numberValue[otpIndex]
    }

    if(mobileNo){
 
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
//           let isUserExist = await publicUser.findOne({
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
      let {encryptMobile:mobileNo,encryptOtp:otp}=req.body

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
             let isUserExist = await publicUser.findOne({
              where:{
                phoneNo:mobileNo
              }
            })
            console.log(isUserExist,'check user')
          // If the user does not exist then we have to send a message to the frontend so that the sign up page will get render
          if(!isUserExist){
            return res.status(statusCode.SUCCESS.code).json({message:"please render the sign up page",decideSignUpOrLogin:0});  
          }
          return res.status(statusCode.SUCCESS.code).json({message:"please render the login page",decideSignUpOrLogin:1});  

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
    let {emailId,mobileNo}= req.body
    let firstField = emailId;
    let secondField = mobileNo
    let Token = await mailToken({firstField,secondField})
    let verifyUrl = process.env.VERIFY_URL+`?token=${Token}`
    const message = `Your account has been created.<br><br>
    This is your emailId <b>${emailId}</b><br>
    Please use the below link to verify the email address</br></br><a href=${verifyUrl}>
    <button style=" background-color: #4CAF50; border: none;
     color: white;
     padding: 15px 32px;
     text-align: center;
     text-decoration: none;
     display: inline-block;
     font-size: 16px;">Update Password</button> </a>
     </br></br>
     This link is valid for 10 mins only  `;
      try {
          await sendEmail({
            email:`${emailId}`,
            subject:"please verify the email for your amabhoomi sign up",
            html:`<p>${message}</p>`
          }
          )
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
    let verifyEmail =1
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
      let mobileNo = decodedEmailToken.secondField
      if (exp * 1000 <= Date.now()) {
        console.log('Token has expired');
        return res.status(statusCode.BAD_REQUEST.code).json({ message: 'Url Expired' });
      }
      else{
        // update the verify email column in database to verfied i.e. 1
       
       let userExist = await publicUser.findOne({
        where:{
          phoneNo:mobileNo
        }
       })
        if(userExist){
          let updateVerifyEmailColumn = await publicUser.update({
            verifyEmail:1
          },
        {
          where:{
            phoneNo:mobileNo
        }})
        return res.status(statusCode.SUCCESS.code).json({
          message:`Email verified Successfully`,verifyEmail:1
        })

        }
        return res.status(statusCode.SUCCESS.code).json({
          message:`Email verified Successfully`,verifyEmail:1
        })
      }
    }
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }
}


let signUp = async (req,res)=>{
 try{
  console.log('1')
  console.log(req.body,'req.body')

    let {encryptEmail:email, encryptPassword:password,encryptFirstName:firstName,encryptMiddleName:middleName,encryptLastName:lastName,encryptPhoneNo:phoneNo,userImage,encryptLanguage:language,activities} = req.body;
    // const decryptUserName = decrypt(userName);
    // const decryptEmailId = decrypt(email);
    // const decryptPhoneNumber = decrypt(phoneNo);
 
    password = await decrypt(password)
    let checkDuplicateMobile= await publicUser.findOne({
        where:{
          phoneNo:{
            [Op.eq]:phoneNo
          }
          
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
   

      // Create a new user record in the database

      const uploadDir = process.env.UPLOAD_DIR;

      // Ensure that the base64-encoded image data is correctly decoded before writing it to the file. Use the following code to decode the base64 data:
      
      const base64Data = userImage
        ? userImage.replace(/^data:image\/\w+;base64,/, "")
        : null;
      console.log(base64Data, "3434559");

      // Convert Base64 to Buffer for user image
      const userImageBuffer = userImage
        ? Buffer.from(base64Data, "base64")
        : null;

      let userImagePath = null;
      let userImagePath2 = null;
      // Save the user image to the specified path
      console.log(userImageBuffer, "fhsifhskhk");
      
      if (userImageBuffer) {
        const userDocDir = path.join(uploadDir, "publicUsers"); // Path to users directory
        // Ensure the users directory exists
        if (!fs.existsSync(userDocDir)) {
          fs.mkdirSync(userDocDir, { recursive: true });
        }
        userImagePath = `${uploadDir}/publicUsers/${userId}_user_image.png`; // Set your desired file name

        fs.writeFileSync(userImagePath, userImageBuffer);
        userImagePath2 = `/publicUsers/${userId}_user_image.png`;
      }
      

      const newUser = await publicUser.create({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        userName: email,
        password: hashedPassword,
        phoneNo: phoneNo,
        emailId: email,
        profilePicture: userImagePath, // Assuming profilePicture is the field for storing the image path
        language:language,
        lastLogin: new Date(), // Example of setting a default value
        statusId: 1, // Example of setting a default value
        createdOn: new Date(), // Set current timestamp for createdOn
        updatedOn: new Date(), // Set current timestamp for updatedOn
     
      });

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

  return { deviceType, deviceName };
}

let publicLogin = async(req,res)=>{

  try{
    console.log("here Response", req.body)

    let {encryptMobile:mobileNo,encryptEmail:emailId,encryptPassword:password}= req.body

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
        
       isUserExist = await publicUser.findOne({
        where: {
          emailId:emailId
        }
        })

        console.log('fj')
      }
      if(mobileNo){
        console.log('mobileNo',mobileNo)
        // mobileNo = await decrypt(mobileNo)
        // check whether the credentials are valid or not 
        // Finding one record
        
       isUserExist = await publicUser.findOne({
        where: {
          phoneNo:mobileNo
        }
        })
        console.log('2 mobile no', isUserExist, 'phoneNumber',mobileNo)
      }


      password = await decrypt(password)
      
      
        if(isUserExist){
          // console.log('21',isUserExist)
          const isPasswordSame = await bcrypt.compare(password, isUserExist.password);
          if(isPasswordSame){
            console.log('isUserExist.publicUserId,isUserExist.userName, isUserExist.emailId',isUserExist.publicUserId, isUserExist.userName, isUserExist.emailId)
            const userName = await decrypt(isUserExist.userName)
            const emailId = await decrypt(isUserExist.emailId)
            const publicUserId = isUserExist.publicUserId
            console.log(isUserExist.publicUserId,userName,emailId)

            let {accessToken,refreshToken} = await generateToken(publicUserId,userName,emailId)

            const options = {
              httpOnly: true,
              secure: true
          };

          let updateLastLoginTime =  await publicUser.update({lastLogin:lastLoginTime},{
            where :{
              publicUserId:isUserExist.publicUserId
            }
          })
          // check for active session

          let checkForActiveSession = await authSessions.findOne({where:{
           [Op.and] :[{userId:isUserExist.publicUserId},
            {active:1}]
          }})
          // if active
          if(checkForActiveSession){

            let updateTheSessionToInactive = await authSessions.update({active:0},{
              where:{
                sessionId:checkForActiveSession.sessionId}
            })
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
                      userId:isUserExist.publicUserId
                    })
                    // then update the session id in the device table
                    let updateTheDeviceTable = await deviceLogin.update({
                      sessionId:insertToAuthSession.sessionId
                    },{
                      where:{
                        deviceId:checkDeviceForParticularSession.deviceId
                      }
                    })
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
                      userId:isUserExist.publicUserId
                    })
                    // update the session id in the device table
                    let updateSessionIdInDeviceTable = await deviceLogin.update({
                      sessionId:insertToAuthSession.sessionId
                    },{
                      where:{
                        deviceId:insertToDeviceTable.deviceId
                      }
                    })
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
                      userId:isUserExist.publicUserId
                    })
                    // update the session id in the device table
                    let updateSessionIdInDeviceTable = await deviceLogin.update({
                      sessionId:insertToAuthSession.sessionId
                    },{
                      where:{
                        deviceId:insertToDeviceTable.deviceId
                      }
                    })

                }
              }
              else{
                return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:"Internal server error"})
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
                userId:isUserExist.publicUserId
              })
              // update the session id in the device table
              let updateSessionIdInDeviceTable = await deviceLogin.update({
                sessionId:insertToAuthSession.sessionId
              },{
                where:{
                  deviceId:insertToDeviceTable.deviceId
                }
              })

          }
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

  
    else if(mobileNo)
      {
     
     let  isUserExist = await publicUser.findOne({
        where: {
          phoneNo:mobileNo
        }
        })          
        // mobileNo = await decrypt(mobileNo)

          let {accessToken,refreshToken} = await generateToken(isUserExist.publicUserId,isUserExist.userName, isUserExist.emailId)

            const options = {
              httpOnly: true,
              secure: true
          };

          let updateLastLoginTime =  await publicUser.update({lastLogin:lastLoginTime},{
            where :{
              publicUserId:isUserExist.publicUserId
            }
          })
          // session and device table data start 
               // check for active session

          let checkForActiveSession = await authSessions.findOne({where:{
            [Op.and] :[{userId:isUserExist.publicUserId},
             {active:1}]
           }})
           // if active
           if(checkForActiveSession){
 
             let updateTheSessionToInactive = await authSessions.update({active:0},{
               where:{
                 sessionId:checkForActiveSession.sessionId}
             })
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
                       userId:isUserExist.publicUserId
                     })
                     // then update the session id in the device table
                     let updateTheDeviceTable = await deviceLogin.update({
                       sessionId:insertToAuthSession.sessionId
                     },{
                       where:{
                         deviceId:checkDeviceForParticularSession.deviceId
                       }
                     })
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
                       userId:isUserExist.publicUserId
                     })
                     // update the session id in the device table
                     let updateSessionIdInDeviceTable = await deviceLogin.update({
                       sessionId:insertToAuthSession.sessionId
                     },{
                       where:{
                         deviceId:insertToDeviceTable.deviceId
                       }
                     })
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
                       userId:isUserExist.publicUserId
                     })
                     // update the session id in the device table
                     let updateSessionIdInDeviceTable = await deviceLogin.update({
                       sessionId:insertToAuthSession.sessionId
                     },{
                       where:{
                         deviceId:insertToDeviceTable.deviceId
                       }
                     })
 
                 }
               }
               else{
                 return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:"Internal server error"})
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
                 userId:isUserExist.publicUserId
               })
               // update the session id in the device table
               let updateSessionIdInDeviceTable = await deviceLogin.update({
                 sessionId:insertToAuthSession.sessionId
               },{
                 where:{
                   deviceId:insertToDeviceTable.deviceId
                 }
               })
 
           }
          // session and device table data end
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

        return res.status(statusCode.SUCCESS.code)
        .header('Authorization', `Bearer ${accessToken}`)
        .json({ message: 'logged in', username: isUserExist.userName, fullname: isUserExist.fullName, email: isUserExist.emailId, role: isUserExist.roleId, accessToken: accessToken,refreshToken:refreshToken,
        //  menuItems: dataJSON
         });
   
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

    let mobileNo = req.body.mobileNo?req.body.mobilNo:null;

    let emailId = req.body.emailId?req.body.emailId:null;

    let password = req.body.password?req.body.password:null;

    

    let lastLoginTime = new Date();

    if(emailId && password || mobileNo && password)
    {

      let isUserExist;
      
      if(emailId){

        emailId= await decrypt(emailId)

        // check whether the credentials are valid or not 
        // Finding one record
        
       isUserExist = await privateUser.findOne({
        where: {
          emailId:emailId
        }
        })

      }
      if(mobileNo){

        mobileNo = await decrypt(mobileNo)
        // check whether the credentials are valid or not 
        // Finding one record
        
       isUserExist = await user.findOne({
        where: {
          phoneNo:mobileNo
        }
        })
      }


      password = await decrypt(password)
      

        if(isUserExist){
          const isPasswordSame = await bcrypt.compare(password, isPasswordSame.password);
          if(isPasswordSame){

            let {accessToken,refreshToken} = await generateToken(isUserExist.userId,isUserExist.userName, isUserExist.emailId)

            const options = {
              httpOnly: true,
              sameSite: 'none',
              secure: true
          };

          let updateLastLoginTime =  await user.update({lastLogin:lastLoginTime},{
            where :{
              userId:isUserExist.userId
            }
          })
            //menu items list fetch
            let menuListItemQuery = `select rr.resourceId, rm.name,rr.parentResourceId,rm.orderIn, rm.path from publicuser pu inner join roleresource rr on rr.roleId = pu.roleId
            inner join resourcemaster rm on rm.resourceId = rr.resourceId and rr.statusId =1 
            where pu.publicUserId = :userId and rr.statusId =1 and rm.statusId =1 
            order by rm.orderIn`

            let menuListItems = await sequelize.query(menuListItemQuery,{
              replacements:{
                userId:isUserExist.userId
              },
              type: QueryTypes.SELECT
            })
 

        let dataJSON = new Array();
        //create parent data json without child data 
        for (let i = 0; i < menuListItems.length; i++) {
            if (menuListItems[i].parentResourceId === null) {
                dataJSON.push({
                    id: menuListItems[i].resourceId,
                    name: menuListItems[i].name,
                    orderIn: menuListItems[i].orderIn,
                    path: menuListItems[i].path,
                    children: new Array()
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
        .json({ message: 'logged in', username: isUserExist.userName, fullname: isUserExist.fullName, email: isUserExist.emailId, role: isUserExist.roleId, accessToken: accessToken,refreshToken:refreshToken, menuItems: dataJSON });
          }

          else{
            return res.status(statusCode.BAD_REQUEST.code).json({
              message:"Invalid Password"
            })
          }
        }


   
}
    else if(mobileNo && otp){
      mobileNo= await decrypt(mobileNo)
      let verifyOtp = await verifyOTPHandlerWithGenerateToken(mobileNo,otp)
      if(verifyOtp?.error=='Please render the signup page'){

        return res.status(statusCode.SUCCESS.code).json({
          message:'please render the signup page'
        })

      }
      else if(verifyOtp?.error){
        return res.status(statusCode.BAD_REQUEST.code).json({
          message:'Otp verification failed'
        })
      }

      if(mobileNo){

        // check whether the credentials are valid or not 
        // Finding one record
        
       isUserExist = await user.findOne({
        where: {
          phoneNo:mobileNo
        }
        })
      }

        if(isUserExist){
          const isPasswordSame = await bcrypt.compare(password, isPasswordSame.password);
      

            let {accessToken,refreshToken} = await generateToken(isUserExist.userId,isUserExist.userName, isUserExist.emailId)

            const options = {
              httpOnly: true,
              sameSite: 'none',
              secure: true
          };

          let updateLastLoginTime =  await user.update({lastLogin:lastLoginTime},{
            where :{
              userId:isUserExist.userId
            }
          })
            //menu items list fetch
            let menuListItemQuery = `select rr.resourceId, rm.name,rr.parentResourceId,rm.orderIn, rm.path from publicuser pu inner join roleresource rr on rr.roleId = pu.roleId
            inner join resourcemaster rm on rm.resourceId = rr.resourceId and rr.statusId =1 
            where pu.publicUserId = :userId and rr.statusId =1 and rm.statusId =1 
            order by rm.orderIn`

            let menuListItems = await sequelize.query(menuListItemQuery,{
              replacements:{
                userId:isUserExist.userId
              },
              type: QueryTypes.SELECT
            })
 

        let dataJSON = new Array();
        //create parent data json without child data 
        for (let i = 0; i < menuListItems.length; i++) {
            if (menuListItems[i].parentResourceId === null) {
                dataJSON.push({
                    id: menuListItems[i].resourceId,
                    name: menuListItems[i].name,
                    orderIn: menuListItems[i].orderIn,
                    path: menuListItems[i].path,
                    children: new Array()
                })
            }
        }
        
        // Set the access token in an HTTP-only cookie named 'accessToken'
        res.cookie('accessToken', accessToken,options);

        // Set the refresh token in a separate HTTP-only cookie named 'refreshToken'
        res.cookie('refreshToken', refreshToken, options)

        return res.status(statusCode.SUCCESS.code)
        .header('Authorization', `Bearer ${accessToken}`)
        .json({ message: 'logged in', username: isUserExist.userName, fullname: isUserExist.fullName, email: isUserExist.emailId, role: isUserExist.roleId, accessToken: accessToken,refreshToken:refreshToken, menuItems: dataJSON });
          


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
     const options = {
         expires: new Date(Date.now() - 1), // Expire the cookie immediately
         httpOnly: true,
         secure: true
     };
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
 sendEmailToUser

}

