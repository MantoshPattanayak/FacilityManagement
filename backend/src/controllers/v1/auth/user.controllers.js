const db = require("../../../models/index");
let statusCode = require("../../../utils/statusCode");
const bcrypt = require("bcrypt");
const user = db.publicuser;


const {encrypt} = require('../../../middlewares/encryption.middlewares')
const {decrypt} = require('../../../middlewares/decryption.middlewares')
const {generateOTP,verifyOTP} = require('../../../utils/mobileOtpGenerateAndVerify')

const passport = require('passport')
require('../../../config/passport')
const generateToken= require('../../../utils/generateToken')

const { Op } = require("sequelize");

let generateOTPHandler = async (req,res)=> {
  try {
    // if anyone first time logs in through google or facebook here it will skip that first step i.e. to check if mobile no. already exist or not. it will directly verify the mobile no  
    let {mobileNo,googleId,facebookId} = req.body
      const response = await generateOTP(mobileNo);
      let checkIfMobileExistOrNot = await user.findAll({
        where:{
          phoneNo:{
            [Op.eq]:mobileNo
          }
        }
      })

      if(checkIfMobileExistOrNot.length==0 && !(googleId) && !(facebookId)){
        return res.status(statusCode.CONFLICT.code).json({
          message:"Please create your profile first"
        })
      }
      // Check if the response indicates success
      if (response && response.status === 'OK') {
          // OTP generated successfully
          return res.status(statusCode.SUCCESS.code).json({
            message: 'otp generated successfully'
          })
      } else {
          // OTP generation failed
          return res.status(statusCode.BAD_REQUEST.code).json({
            message: 'Failed to generate OTP. Please try again later.'
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

let verifyOTPHandlerWithGenerateToken = async (req,res)=>{
  try {
    let {mobileNo, otp,} = req.body
      // Call the API to verify OTP
      const response = await verifyOTP(mobileNo, otp); // Replace with your OTP verification API call

      // Check if OTP verification was successful
      if (response && response.status === 'OK') {
          // OTP verified successfully
          // Check if the user exists in the database
          let user = await getUserByMobileNumber(mobileNo); // Replace with your function to retrieve user by mobile number from the database

          // If user doesn't exist, create a new user
          if (!user) {
              // Create new user
              user = await createUser({ mobileNo }); // Replace with your function to create a new user in the database
          }

          // Generate tokens for the user
          const { id, user_name, email_id } = user;
          const { accessToken, refreshToken } = await generateTokens({ id, user_name, email_id });

          // Return the generated tokens
          return { accessToken, refreshToken };
      } else {
          // OTP verification failed
          throw new Error('OTP verification failed');
      }
  } catch (error) {
      console.error('Error verifying OTP and generating tokens:', error);
      throw error; // Forward the error to the caller
  }
}


let signUp = async (req,res)=>{
 try{
  let generateOtpForMobile = await generateOTP(decrypt(phoneNo))
  const { userName, email, password,roleId,title, firstName,middleName,lastName,phoneNo,altPhoneNo,userImage,remarks} = req.body;
 


  const decryptUserName = decrypt(userName);
  const decryptEmailId = decrypt(email);
  const decryptPhoneNumber = decrypt(phoneNo);

   const checkDuplicateMobile= await user.findAll({
      where:{
        phoneNo:{
          [Op.eq]:decryptPhoneNumber
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
    const userImageBuffer = omnerImage
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
      userImagePath2 = `/publicUsers/${userId}_driver_image.png`;
    }

    const newUser = await user.create({
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
      status: 1, // Example of setting a default value
      remarks: remarks,
      createdBy: createdBy,
      updatedBy: updatedBy,
      createdOn: new Date(), // Set current timestamp for createdOn
      updatedOn: new Date(), // Set current timestamp for updatedOn
      // Ensure to set other fields accordingly
      deletedBy: null,
      deletedOn: null,
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

let login = async(req,res)=>{

  try{

    let mobileNo = req.body.mobileNo?req.body.mobilNo:null;

    let emailId = req.body.emailId?req.body.emailId:null;

    let password = req.body.password?req.body.password:null;

    let lastLoginTime = new Date();
    if(emailId&&password){
      emailId= await decrypt(emailId)
      password = await decrypt(password)
      // check whether the credentials are valid or not 
      // Finding one record
      const isUserExist = await user.findOne({
            where: {
              emailId:emailId
        }
      })

        if(isUserExist){
          const isPasswordSame = await bcrypt.compare(password, isPasswordSame.password);
          if(isPasswordSame){
            let generateAccessToken = await generateToken(isUserExist.userId,isUserExist.userName, isUserExist.emailId)
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
            let query = await sequelize.query(`
            select rr.resourceId, rm.name,rr.parentResourceId,rm.orderIn, rm.path from publicUser pu inner join roleResource rr on rr.roleId = pu.roleId
            inner join       
            select rr.resource_id , rm.name, rr.parent_resource_id, rm.order_in, rm."path" 
            from admin.user_master um
            inner join admin.role_resource rr on rr.role_id = um.role_id
            inner join admin.resource_master rm on rr.resource_id = rm.id and rr.status_id = 1
            where um.id = $1 and rr.status_id = 1 and rm.status_id = 1
            order by rm.order_in`, [users.rows[0].id]
        );

        let dataJSON = new Array();

        //create parent data json without child data 
        for (let i = 0; i < query.rows.length; i++) {
            if (query.rows[i].parent_resource_id === null) {
                dataJSON.push({
                    id: query.rows[i].resource_id,
                    name: query.rows[i].name,
                    order_in: query.rows[i].order_in,
                    path: query.rows[i].path,
                    children: new Array()
                })
            }
        }

          }

          else{
            return res.status(statusCode.BAD_REQUEST.code).json({
              message:"Invalid Password"
            })
          }
        }


   
}

    else if(mobileNo&&password){
      mobileNo= await decrypt(mobileNo)
      password = await decrypt(password)
    }

    else if(mobileNo){
      mobileNo= await decrypt(mobileNo)

    }

  }
  catch(err){
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }


}


let googleAuthenticationCallback = async (req,res)=>{
  if (req.user.requiresMobileVerification) {
    // Prompt user to enter mobile number
    const { email, name,photo } = req.user;
    const redirectUrl = '/collect-mobile';
    res.json({ email, name, photo, redirectUrl });
  } else {
    // User already exists, redirect to profile
    res.redirect('/profile');
  }
}


let facebookAuthenticationCallback = async(req,res)=>{
  if (req.user.requiresMobileVerification) {
    // Prompt user to enter mobile number
    const { email, name,photo } = req.user;
    const redirectUrl = '/collect-mobile';
    res.json({ email, name, photo, redirectUrl });  
  } else {
    // User already exists, redirect to profile
    res.redirect('/profile');
  }
}

module.exports = {
  signUp,
  googleAuthenticationCallback,
  facebookAuthenticationCallback,
  generateOTPHandler,
  verifyOTPHandlerWithGenerateToken
 
}

module.exports = {
  signUp,
  login
};

