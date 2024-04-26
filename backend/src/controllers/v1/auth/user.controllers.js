const db = require("../../../models/index");
let statusCode = require("../../../utils/statusCode");
const bcrypt = require("bcrypt");
const publicUser = db.publicuser;
const privateUser = db.privateuser;
// const admin = require('firebase-admin');

const { sequelize,Sequelize } = require('../../../models')

const {encrypt} = require('../../../middlewares/encryption.middlewares')
const {decrypt} = require('../../../middlewares/decryption.middlewares')
const {generateOTP,verify1OTP} = require('../../../utils/mobileOtpGenerateAndVerify')

const passport = require('passport')
require('../../../config/passport')
const generateToken= require('../../../utils/generateToken')

const { Op } = require("sequelize");

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


// Endpoint to request OTP
//  let requestOTP = async (req, res) => {
//   try {
//     const { mobileNo } = req.body;

//     await admin.auth().generatePhoneVerificationCode(mobileNo);
//     res.status(statusCode.SUCCESS.code).json({ message: 'OTP sent successfully' });
//   } catch (err) {
//     console.error('Error sending OTP:', err);
//     res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: 'Failed to send OTP' });
//   }
// };

// Endpoint to verify OTP
//  let verifyOTP = async (req, res) => {
//   try {
//     const { mobileNo, otp } = req.body;
//     const userCredential = await admin.auth().signInWithPhoneNumber(mobileNo, otp);
//     console.log('User authenticated:', userCredential.user);
//     res.status(statusCode.SUCCESS.code).json({ message: 'OTP verified successfully' });
//   } catch (err) {
//     console.error('Error verifying OTP:', err);
//     res.status(statusCode.BAD_REQUEST.code).json({ message: 'Invalid OTP' });
//   }
// };


let signUp = async (req,res)=>{
 try{
    const { userName, email, password,roleId,title, firstName,middleName,lastName,phoneNo,altPhoneNo,userImage,remarks} = req.body;
    const decryptUserName = decrypt(userName);
    const decryptEmailId = decrypt(email);
    const decryptPhoneNumber = decrypt(phoneNo);

    const checkDuplicateMobile= await publicUser.findAll({
        where:{
          phoneNo:{
            [Op.eq]:phoneNo
          }
          
        }
      })

      if(checkDuplicateMobile>0){
        return res.status(statusCode.CONFLICT.code).json({
          message:"This mobile is already allocated to existing user"
        })
      }


      
      let lastLogin = new Date();
      let updatedOn =  new Date();
      let createdOn = new Date();
      let deletedOn = new Date();



      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      let createdBy = req.user.id;
      let updatedBy = req.user.id;

      // Create a new user record in the database

      const uploadDir = process.env.UPLOAD_DIR;

      // Ensure that the base64-encoded image data is correctly decoded before writing it to the file. Use the following code to decode the base64 data:
      
      const base64Data = userImage
        ? userImage.replace(/^data:image\/\w+;base64,/, "")
        : null;
      console.log(base64Data, "3434559");

      // Convert Base64 to Buffer for driver image
      const userImageBuffer = ownerImage
        ? Buffer.from(base64Data, "base64")
        : null;

      let userImagePath = null;
      let userImagePath2 = null;
      // Save the driver image to the specified path
      console.log(userImageBuffer, "fhsifhskhk");
      
      if (userImageBuffer) {
        const userDocDir = path.join(uploadDir, "publicUsers"); // Path to drivers directory
        // Ensure the drivers directory exists
        if (!fs.existsSync(userDocDir)) {
          fs.mkdirSync(userDocDir, { recursive: true });
        }
        userImagePath = `${uploadDir}/publicUsers/${userId}_user_image.png`; // Set your desired file name

        fs.writeFileSync(userImagePath, userImageBuffer);
        userImagePath2 = `/publicUsers/${userId}_user_image.png`;
      }

      const newUser = await publicUser.create({
        roleId: roleId,
        title: title,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        userName: userName,
        password: hashedPassword,
        phoneNo: phoneNo,
        altPhoneNo: altPhoneNo,
        emailId: email,
        profilePicture: userImagePath, // Assuming profilePicture is the field for storing the image path
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


let publicLogin = async(req,res)=>{

  try{

    let mobileNo = req.body.mobileNo?req.body.mobilNo:null;

    let emailId = req.body.emailId?req.body.emailId:null;

    let password = req.body.password?req.body.password:null;

    let otp = req.body.otp?req.body.otp:null;

    let lastLoginTime = new Date();
    if(emailId && password || mobileNo && password)
    {

      let isUserExist;
      
      if(emailId){

        emailId= await decrypt(emailId)

        // check whether the credentials are valid or not 
        // Finding one record
        
       isUserExist = await user.findOne({
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
          contactNo:mobileNo
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
      let isUserExist;
      let verifyOtp = await verifyOTPHandlerWithGenerateToken(mobileNo,otp)
      if(verifyOtp?.error=='Please render the signup page'){

        return res.status(statusCode.SUCCESS.code).json({
          message:'please render the signup page'
        })

      }
      if(verifyOtp?.error){
        return res.status(statusCode.BAD_REQUEST.code).json({
          message:'Otp verification failed'
        })
      }

      if(verifyOtp==null){

        // check whether the credentials are valid or not 
        // Finding one record
        
       isUserExist = await user.findOne({
        where: {
          contactNo:mobileNo
        }
        })
      }

        if(isUserExist){
          const isPasswordSame = await bcrypt.compare(password, isPasswordSame.password);
      

            let {accessToken,refreshToken} = await generateToken(isUserExist.userId,isUserExist.userName, isUserExist.emailId)

            const options = {
              httpOnly: true,
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
          contactNo:mobileNo
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
          contactNo:mobileNo
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


// let googleAuthenticationCallback = async (req,res)=>{
//   if (req.user.requiresMobileVerification) {
//     // Prompt user to enter mobile number
//     const { email, name,photo } = req.user;
//     const redirectUrl = '/collect-mobile';
//     res.json({ email, name, photo, redirectUrl });
//   } else {
//     // User already exists, redirect to profile
//     res.redirect('/profile');
//   }
// }


// let facebookAuthenticationCallback = async(req,res)=>{
//   if (req.user.requiresMobileVerification) {
//     // Prompt user to enter mobile number
//     const { email, name,photo } = req.user;
//     const redirectUrl = '/collect-mobile';
//     res.json({ email, name, photo, redirectUrl });  
//   } else {
//     // User already exists, redirect to profile
//     res.redirect('/profile');
//   }
// }

module.exports = {
  signUp,
  // googleAuthenticationCallback,
  // facebookAuthenticationCallback,
  // generateOTPHandler,
  // verifyOTPHandlerWithGenerateToken,
 publicLogin,
 logout,
//  requestOTP,
//  verifyOTP
}

