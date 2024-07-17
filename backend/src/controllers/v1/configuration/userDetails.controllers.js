const { sequelize, Sequelize } = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const db = require("../../../models");
const bcrypt = require("bcrypt");
const { decrypt } = require("../../../middlewares/decryption.middlewares");
const { encrypt } = require("../../../middlewares/encryption.middlewares");
const user = db.usermaster;
const facilityTypeMaster = db.facilitytype;
const statusCodeMaster = db.statusmaster;
const bookmarks = db.bookmarks;
const hosteventdetails = db.hosteventdetails;
const mailToken = require('../../../middlewares/mailToken.middlewares')
const sendEmail = require('../../../utils/generateEmail')
let otpCheck = db.otpDetails
const { Op } = require("sequelize");
let generateToken = require('../../../utils/generateToken');
let authSessions = db.authsessions
let deviceLogin = db.device
let QueryTypes = db.QueryTypes
let userActivityPreference = db.userActivityPreference

let autoSuggestionForUserSearch = async (req, res) => {
  try {
    const givenReq = req.query.givenReq ? req.body.givenReq : null;
    // const decryptGivenReq = await decrypt(givenReq).toLowerCase();

    let allUsersDataQuery = `    
    SELECT COUNT(*) OVER() AS totalCount,
    pu.userId, pu.title, pu.fullName, pu.emailId, pu.userName, pu.phoneNo, 
    rm.roleName, sm.statusCode
    FROM amabhoomi.rolemasters rm
    LEFT JOIN amabhoomi.usermasters pu ON pu.roleId = rm.roleId
    INNER JOIN statusmasters sm ON sm.statusId = rm.statusId
    `;

    let allUsersData = await sequelize.query(allUsersDataQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    // Decrypt all encrypted fields
    let decryptedUsers = allUsersData.map(async (userData) => ({
      ...userData,
      title: await decrypt(userData.title),
      fullName: await decrypt(userData.fullName),
      emailId: await decrypt(userData.emailId),
      userName: await decrypt(userData.userName),
      phoneNo: await decrypt(userData.phoneNo),
    }));

    let matchedSuggestions = decryptedUsers;

    if (givenReq) {
      matchedSuggestions = decryptedUsers.filter(
        (userData) =>
          userData.privateUserId.includes(givenReq) ||
          userData.title.toLowerCase().includes(givenReq) ||
          userData.fullName.toLowerCase().includes(givenReq) ||
          userData.emailId.toLowerCase().includes(givenReq) ||
          userData.userName.toLowerCase().includes(givenReq) ||
          userData.phoneNo.toLowerCase().includes(givenReq) ||
          userData.roleName.toLowerCase().includes(givenReq) ||
          userData.status.toLowerCase().includes(givenReq)
      );
    }
    // const encryptedData = matchedSuggestions.map(async (userData) => ({
    //     ...userData,
    //     title: await encrypt(userData.title),
    //     fullName: await encrypt(userData.fullName),
    //     emailId: await encrypt(userData.emailId),
    //     userName: await encrypt(userData.userName),
    //     contactNo: await encrypt(userData.contactNo),
    //     roleName: await encrypt(userData.roleName),
    //     status: await encrypt(userData.status)
    //   }));
    return res.status(statusCode.SUCCESS.code).json({
      message: "All users data",
      data: matchedSuggestions,
    });
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};

let viewList = async (req, res) => {
  try {
    let givenReq = req.body.givenReq ? req.body.givenReq : null; // Convert givenReq to lowercase
    let limit = req.body.page_size ? req.body.page_size : 500;
    let page = req.body.page_number ? req.body.page_number : 1;
    let offset = (page - 1) * limit;
    let params = [];
    let getAllUsersQuery = `SELECT COUNT(*) OVER() AS totalCount,
        pu.userId, pu.title, pu.fullName, pu.emailId, pu.userName, pu.phoneNo, pu.statusId,
        rm.roleName
        FROM amabhoomi.rolemasters rm
        Inner JOIN amabhoomi.usermasters pu ON pu.roleId = rm.roleId order by pu.userId desc`;
    // , sm.statusCode
    // INNER JOIN statusmasters sm ON sm.statusId = rm.statusId

    let getAllUsers = await sequelize.query(getAllUsersQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    console.log(getAllUsers, "getAllUsers");
    // let givenReqDecrypted = await decrypt(givenReqEncrypted).toLowerCase()

    // Decrypt all encrypted fields
    let decryptedUsers = await Promise.all(
      getAllUsers.map(async (userData) => {
        if (
          !userData ||
          !userData.title ||
          !userData.fullName ||
          !userData.emailId ||
          !userData.userName ||
          !userData.phoneNo
        ) {
          return userData; // Skip decryption if userData or its fields are null or undefined
        }
        return {
          ...userData,
          title: await decrypt(userData.title),
          fullName: await decrypt(userData.fullName),
          emailId: await decrypt(userData.emailId),
          userName: await decrypt(userData.userName),
          phoneNo: await decrypt(userData.phoneNo),
        };
      })
    );

    console.log("g");
    console.log(decryptedUsers, "decryptedUsers");
    // Filter data based on the encrypted search term
    let filteredUsers = decryptedUsers;

    console.log("5");
    if (givenReq) {
      givenReq = givenReq.toLowerCase();

      filteredUsers = decryptedUsers.filter(
        (userData) =>
          userData.title?.toLowerCase().includes(givenReq) ||
          userData.fullName?.toLowerCase().includes(givenReq) ||
          userData.emailId?.toLowerCase().includes(givenReq) ||
          userData.userName?.toLowerCase().includes(givenReq) ||
          userData.phoneNo?.toLowerCase().includes(givenReq) ||
          userData.roleName?.toLowerCase().includes(givenReq)
        // ||
        // userData.statusCode.toLowerCase().includes(givenReq)
      );
    }
    console.log("filteruser", filteredUsers);

    // Paginate the filtered data
    let paginatedUsers = filteredUsers.slice(offset, offset + limit);
    // Encrypt the data before sending it to the client

    // const encryptedData = paginatedUsers.map(async (userData) => ({
    //   ...userData,
    //   title: await encrypt(userData.title),
    //   fullName: await encrypt(userData.fullName),
    //   emailId: await encrypt(userData.emailId),
    //   userName: await encrypt(userData.userName),
    //   contactNo: await encrypt(userData.contactNo),
    //   roleName: await encrypt(userData.roleName),
    //   status:await encrypt(userData.status)
    // }));

    return res.status(statusCode.SUCCESS.code).json({
      message: "All users data",
      data: paginatedUsers,
    });
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};

let generatePassword = async (length) => {
  let charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

let createUser = async (req, res) => {
  try {
    const pwdFlag = false;

    const {
      encryptTitle,
      encryptFullName: encryptfullName,
      encryptMobileNo: encryptMobileNumber,
      encryptRole,
      encryptStatus,
      encryptEmailId: encryptemailId,
      encryptGenderId
    } = req.body;

    // console.log(title, fullName, userName, mobileNumber, alternateMobileNo, emailId, roleId, statusId, genderId, 'input')
    console.log(req.body, "req.body");

    let password = await generatePassword(8);
    let sentPassword = password;
    let roleId = await decrypt(encryptRole);
    let statusId = await decrypt(encryptStatus);
    let genderId;
    if(encryptGenderId){
      console.log('2323223')
      genderId =await decrypt(encryptGenderId) ;
      console.log('gender Id after decryption',genderId)
    }
     

    if (roleId == 4) {
      return res.status(statusCode.BAD_REQUEST.code).json({ message: 'Please provide the role id of the BDA staff' })
    }
    // const encryptTitle = await encrypt(title);
    // const encryptfullName = await encrypt(fullName);
    // const encryptUserName = await encrypt(userName);
    // const encryptMobileNumber = await encrypt(mobileNumber);
    // const encryptAlternateMobileNumber = await encrypt(alternateMobileNo);
    // const encryptemailId = await encrypt(emailId);

    console.log(
      "1",
      encryptTitle,
      encryptfullName,
      encryptMobileNumber,
    );
    let encryptUserName = encryptemailId;

    const createdBy = req.user?.userId || 1;
    const updatedBy = req.user?.userId || 1;
    console.log("1");
    const existingUserMobile = await user.findOne({
      where: { phoneNo: encryptMobileNumber },
    });
    const existingUserEmail = await user.findOne({
      where: { emailId: encryptemailId },
    });
    const existingUserName = await user.findOne({
      where: { userName: encryptUserName },
    });
    // const existingAlternateUserMobile = await user.findOne({
    //   where: { phoneNo: encryptAlternateMobileNumber },
    // });

    if (existingUserMobile) {
      return res
        .status(statusCode.CONFLICT.code)
        .json({ message: "User already exist same contact_no" });
    } else if (existingUserEmail) {
      return res
        .status(statusCode.CONFLICT.code)
        .json({ message: "User already exist same email_id" });
    } else if (existingUserName) {
      return res
        .status(statusCode.CONFLICT.code)
        .json({ message: "User already exist same user_name" });
    }
    //  else if (existingAlternateUserMobile) {
    //   return res
    //     .status(statusCode.CONFLICT.code)
    //     .json({
    //       message: "User already exist with given alternate contact no ",
    //     });
    // } 
    else {
      console.log('343')
      const hashedPassword = await bcrypt.hash(password, 10); // Use 10 rounds for hashing

      console.log(hashedPassword,'new user 277');

      console.log("req.body", encryptTitle, encryptfullName, encryptemailId, encryptUserName, hashedPassword, pwdFlag, roleId, statusId, genderId );

      const newUser = await user.create({
        title: encryptTitle,
        fullName: encryptfullName,
        phoneNo: encryptMobileNumber,
        emailId: encryptemailId,
        userName: encryptUserName,
        password: hashedPassword,
        changePwdFlag: pwdFlag,
        roleId: roleId,
        statusId: statusId,
        genderId: genderId,
        createdDt: new Date(),
        createdBy: createdBy,
        updatedDt: new Date(),
        updatedBy: updatedBy,
      });

      console.log("12",newUser);

      let firstField = decrypt(encryptemailId);
      let secondField = decrypt(encryptMobileNumber)
      let Token = await mailToken({ firstField, secondField })
      let verifyUrl = process.env.VERIFY_URL + `?token=${Token}`



      message = `Please verify your emailId.<br><br>
        This is your emailId <b>${firstField}</b><br>
        This is your password <b>${sentPassword}</b><br>
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


      try {
        await sendEmail({
          email: `${firstField}`,
          subject: "please verify the email for your amabhoomi user creation",
          html: `<p>${message}</p>`
        }
        )

        return res
          .status(statusCode.SUCCESS.code)
          .json({ message: "User created successfully  and mail is sent and please verify the mail " });
      }
      catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: "user created but mail not sent" })
      }

    }
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};

//token generation
let tokenAndSessionCreation = async (isUserExist, lastLoginTime, deviceInfo) => {
  try {
    let userName = decrypt(isUserExist.userName)
    let emailId
    let sessionId;
    let roleId = isUserExist.roleId
    if (isUserExist.emailId != null) {
      emailId = decrypt(isUserExist.emailId)

    }

    let userId = isUserExist.userId
    console.log(isUserExist.userId, userName, emailId, roleId)

    console.log(userId, userName, emailId, roleId, 'roleId')

    let accessAndRefreshToken = await generateToken(userId, userName, emailId, roleId)

    console.log(accessAndRefreshToken, "accessAndRefreshToken")
    if (accessAndRefreshToken?.error) {
      return {
        error: accessAndRefreshToken.error
      }
    }
    let { accessToken, refreshToken } = accessAndRefreshToken;

    console.log(accessToken, refreshToken, 'accessToken and refresh token')
    const options = {
      httpOnly: true,
      secure: true
    };

    let updateLastLoginTime = await user.update({ lastLogin: lastLoginTime }, {
      where: {
        userId: isUserExist.userId
      }
    })
    // check for active session

    let checkForActiveSession = await authSessions.findOne({
      where: {
        [Op.and]: [{ userId: isUserExist.userId },
        { active: 1 }]
      }
    })
    // if active
    if (checkForActiveSession) {

      let updateTheSessionToInactive = await authSessions.update({ active: 2 }, {
        where: {
          sessionId: checkForActiveSession.sessionId
        }
      })
      console.log('update the session To inactive', updateTheSessionToInactive)
      // after inactive
      if (updateTheSessionToInactive.length > 0) {
        // check if it is present in the device table or not
        let checkDeviceForParticularSession = await deviceLogin.findOne({
          where: {
            sessionId: checkForActiveSession.sessionId
          }
        })
        if (checkDeviceForParticularSession) {
          if (checkDeviceForParticularSession.deviceName == deviceInfo.deviceName && checkDeviceForParticularSession.deviceType == deviceInfo.deviceType) {
            // insert to session table first 
            let insertToAuthSession = await authSessions.create({
              lastActivity: new Date(),
              active: 1,
              deviceId: checkDeviceForParticularSession.deviceId,
              userId: isUserExist.userId
            })
            // then update the session id in the device table
            let updateTheDeviceTable = await deviceLogin.update({
              sessionId: insertToAuthSession.sessionId
            }, {
              where: {
                deviceId: checkDeviceForParticularSession.deviceId
              }
            })
            sessionId = insertToAuthSession.sessionId
          }
          else {
            // insert to device table 
            let insertToDeviceTable = await deviceLogin.create({
              deviceType: deviceInfo.deviceType,
              deviceName: deviceInfo.deviceName,

            })

            // Insert to session table
            let insertToAuthSession = await authSessions.create({
              lastActivity: new Date(),
              active: 1,
              deviceId: insertToDeviceTable.deviceId,
              userId: isUserExist.userId
            })
            // update the session id in the device table
            let updateSessionIdInDeviceTable = await deviceLogin.update({
              sessionId: insertToAuthSession.sessionId
            }, {
              where: {
                deviceId: insertToDeviceTable.deviceId
              }
            })

            sessionId = insertToAuthSession.sessionId
          }
          console.log('session id ', sessionId)
        }
        else {
          console.log('session id2 ', sessionId)

          // insert to device table 
          let insertToDeviceTable = await deviceLogin.create({
            deviceType: deviceInfo.deviceType,
            deviceName: deviceInfo.deviceName,

          })

          // Insert to session table
          let insertToAuthSession = await authSessions.create({
            lastActivity: new Date(),
            active: 1,
            deviceId: insertToDeviceTable.deviceId,
            userId: isUserExist.userId
          })
          // update the session id in the device table
          let updateSessionIdInDeviceTable = await deviceLogin.update({
            sessionId: insertToAuthSession.sessionId
          }, {
            where: {
              deviceId: insertToDeviceTable.deviceId
            }
          })
          sessionId = insertToAuthSession.sessionId

        }
        console.log('session 3', sessionId)
      }
      else {
        console.log('session 4', sessionId)

        return {
          error: 'Something Went Wrong'
        }

      }


    }
    else {
      // insert to device table 
      let insertToDeviceTable = await deviceLogin.create({
        deviceType: deviceInfo.deviceType,
        deviceName: deviceInfo.deviceName,

      })

      // Insert to session table
      let insertToAuthSession = await authSessions.create({
        lastActivity: new Date(),
        active: 1,
        deviceId: insertToDeviceTable.deviceId,
        userId: isUserExist.userId
      })
      // update the session id in the device table
      let updateSessionIdInDeviceTable = await deviceLogin.update({
        sessionId: insertToAuthSession.sessionId
      }, {
        where: {
          deviceId: insertToDeviceTable.deviceId
        }
      })
      sessionId = insertToAuthSession.sessionId
    }
    console.log('session id5', encrypt(sessionId), sessionId)
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      sessionId: encrypt(sessionId),
      options: options
    }

  } catch (err) {
    return {
      error: 'Something Went Wrong'
    }
  }
}

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

let verifyOTPHandlerWithGenerateTokenForAdmin = async (req, res) => {
  try {
    // Call the API to verify OTP
    // const response = await verifyOTP(mobileNo, otp); // Replace with your OTP verification API call

    // Check if OTP verification was successful
    console.log("admin ",req.body)
    let statusId = 1;
    let { encryptMobile: mobileNo, encryptOtp: otp } = req.body

    let userAgent = req.headers['user-agent'];

    console.log('userAgent', userAgent)
    let deviceInfo = parseUserAgent(userAgent)
    let lastLoginTime = new Date();


    if (mobileNo && otp) {
      console.log('23232')
      // check if the otp is valid or not
      let isOtpValid = await otpCheck.findOne({
        where: {
          expiryTime: { [Op.gte]: new Date() },
          code: otp,
          mobileNo: mobileNo
        }
      })
      if (isOtpValid) {
        let updateTheVerifiedValue = await otpCheck.update({ verified: 1 }
          , {
            where: {
              id: isOtpValid.id
            }
          }
        )
        console.log(updateTheVerifiedValue, 'update the verified value')
        // Check if the user exists in the database
        let isUserExist = await user.findOne({
          where: {
            [Op.and]: [
              { phoneNo: mobileNo },
              { statusId: statusId },
              { roleId: { [Op.ne]: 4 } } // roleId should not be equal to 4
            ]
          }
        });
        // console.log(isUserExist,'check user')
        // If the user does not exist then we have to send a message to the frontend so that the sign up page will get render
        if (!isUserExist) {

          return res.status(statusCode.SUCCESS.code).json({ message: "please render the sign up page", decideSignUpOrLogin: 0 });

        }

        console.log('2', isUserExist)
        let tokenGenerationAndSessionStatus = await tokenAndSessionCreation(isUserExist, lastLoginTime, deviceInfo);

        console.log('all the data', tokenGenerationAndSessionStatus)

        if (tokenGenerationAndSessionStatus?.error) {

          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: tokenAndSessionCreation.error
          })

        }

        console.log('here upto it is coming')
        let { accessToken, refreshToken, options, sessionId } = tokenGenerationAndSessionStatus
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

        console.log('resources', dataJSON);
        // Set the access token in an HTTP-only cookie named 'accessToken'
        res.cookie('accessToken', accessToken, options);

        // Set the refresh token in a separate HTTP-only cookie named 'refreshToken'
        res.cookie('refreshToken', refreshToken, options)

        // bearer is actually set in the first to tell that  this token is used for the authentication purposes

        return res.status(statusCode.SUCCESS.code)
          .header('Authorization', `Bearer ${accessToken}`)
          .json({ message: "please render the login page", username: isUserExist.userName, fullname: isUserExist.fullName, email: isUserExist.emailId, role: isUserExist.roleId, accessToken: accessToken, refreshToken: refreshToken, decideSignUpOrLogin: 1, sid: sessionId, authorizedResource: dataJSON });

      }
      else {
        return res.status(statusCode.BAD_REQUEST.code).json({
          message: "Invalid Otp"
        })
      }

      // Return the generated tokens
    } else {
      // OTP verification failed
      return res.status(statusCode.BAD_REQUEST.code).json({ message: 'Please provide the mobileNo and otp' });
    }
  } catch (err) {

    return res.status(statusCode.BAD_REQUEST.code).json({ message: err.message });


  }
}
let updateUserData = async (req, res) => {
  try {
    let {
      userId,
      title,
      fullName,
      userName,
      mobileNo,
      emailId,
      roleId,
      statusId,
      genderId,
    } = req.body; //await decrypt(req.body);


    let updatedValueObject = {};

    userId = decrypt(userId)

    console.log('req body', req.body, userId)
    const getUser = await user.findOne({
      where: {
        userId: userId,
      },
    });
    console.log(getUser, "getUser");

    if (getUser) {
      if (getUser.dataValues.fullName != fullName && fullName) {
        updatedValueObject.fullName = fullName;
      }

      if (getUser.userName != userName && userName) {
        let checkIsUsernameAlreadyPresent = await user.findOne({
          where: {
            userName: userName,
          },
        });
        if (checkIsUsernameAlreadyPresent) {
          return res.status(statusCode.CONFLICT.code).json({
            message: "This username is already existing ",
          });
        }
        updatedValueObject.userName = userName;
      }

      console.log('decrypted mobileno', mobileNo)
      if (getUser.phoneNo != mobileNo && mobileNo) {
        console.log(decrypt(getUser.phoneNo), decrypt(mobileNo))
        let checkIsMobileAlreadyPresent = await user.findOne({
          where: {
            phoneNo: mobileNo,
          },
        });
        if (checkIsMobileAlreadyPresent) {
          return res.status(statusCode.CONFLICT.code).json({
            message: "This mobile no is already assigned to a existing user",
          });
        }
        updatedValueObject.phoneNo = mobileNo;
      }

      // if ((await decrypt(getUser.phoneNo)) != alternateMobileNo) {
      //   let checkIsAlternateMobileAlreadyPresent = await user.findOne({
      //     where: {
      //       contactNo: encryptAlternateMobileNo,
      //     },
      //   });
      //   if (checkIsAlternateMobileAlreadyPresent) {
      //     return res.status(statusCode.CONFLICT.code).json({
      //       message: "This mobile no is already assigned to a existing user",
      //     });
      //   }
      //   updatedValueObject.mobileNo = encryptMobileNumber;
      // }
      if (getUser.title != title && title) {
        updatedValueObject.title = title;
      }
      if (getUser.dataValues.emailId != emailId &&
        emailId != null
      ) {
        let checkIsEmailAlreadyPresent = await user.findOne({
          where: {
            emailId: emailId,
          },
        });
        if (checkIsEmailAlreadyPresent) {
          return res.status(statusCode.CONFLICT.code).json({
            message: "This email id is already assigned to a existing user",
          });
        }
        updatedValueObject.emailId = emailId;
      }
      if (getUser.roleId != roleId && roleId) {
        updatedValueObject.roleId = roleId;
      }
      if (getUser.statusId != statusId && statusId) {
        updatedValueObject.statusId = statusId;
      }
      if (getUser.gender != genderId && genderId) {
        updatedValueObject.gender = genderId;
      }

      let [updatedValueCounts, updatedMetaData] = await user.update(
        updatedValueObject,
        {
          where: {
            userId: getUser.userId,
          },
        }
      );
      if (updatedValueCounts > 0) {
        return res
          .status(statusCode.SUCCESS.code)
          .json({ message: "User record is updated successfully" });
      }
      return res
        .status(statusCode.BAD_REQUEST.code)
        .json({ message: "Not a single record is updated" });
    } else {
      return res
        .status(statusCode.BAD_REQUEST.code)
        .json({ message: "This user doesn't  exist in our record" });
    }
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};

let getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('userID', userId)
    let specificUser = await sequelize.query(
      `select title,fullName,emailId,userName,phoneNo,roleId,statusId,genderId from amabhoomi.usermasters where userId= ?`,
      {
        replacements: [userId], // Pass the parameter value as an array
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    console.log('user', specificUser)

    // let userEncryptedData = await Promise.all(
    //   specificUser.map(async (user) => {
    //     return {
    //       ...user,
    //       title: await decrypt(user.title),
    //       fullName: await decrypt(user.fullName),
    //       emailId: await decrypt(user.emailId),
    //       userName: await decrypt(user.userName),
    //       contactNo: await decrypt(user.contactNo),
    //     };
    //   })
    // );

    return res
      .status(statusCode.SUCCESS.code)
      .json({ message: "Required User", data: specificUser });
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};

let fetchInitialData = async (req, res) => {
  try {
    let roleData = await sequelize.query(
      `select  roleId, roleCode, roleName from amabhoomi.rolemasters `,
      { type: Sequelize.QueryTypes.SELECT }
    );

    let statusData = await sequelize.query(
      `select statusId,statusCode, description from amabhoomi.statusmasters`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    let genderData = await sequelize.query(
      `select genderId, genderCode, genderName from amabhoomi.gendermasters`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // roleData = roleData.map(async(role)=>({
    //     roleId:role.roleId,
    //     roleName:await encrypt(role.roleName),
    //     roleCode:await encrypt(role.roleCode)
    // }))

    // genderData = genderData.map(async(genderValue)=>({
    //     gender:genderValue.gender,
    //     code:await encrypt(genderValue.code),
    //     description:await encrypt(genderValue.description)

    // }))

    // statusData = statusData.map(async(statusData)=>({
    //     status:statusData.status,
    //     statusCode:await encrypt(statusData.statusCode),
    //     description:await encrypt(statusData.description)
    // }))

    return res.status(statusCode.SUCCESS.code).json({
      message: "All initial data to be populated in the dropdown",
      Role: roleData,
      Status: statusData,
      gender: genderData,
    });
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};

let viewBookings = async (req, res) => {
  try {
    console.log("view bookings");
    let userId = req.user?.userId || 1;
    let fromDate = req.body.fromDate
      ? new Date(req.body.fromDate)
      : null || null;
    let toDate = req.body.toDate ? new Date(req.body.toDate) : null || null;
    let bookingStatus = req.body.bookingStatus.length > 0 ? req.body.bookingStatus.join(',') : null;
    let facilityTypeId = req.body.facilityType.length > 0 ? req.body.facilityType.join(',') : null; //EVENTS-6   EVENT_HOST_REQUEST-7   PARKS -1  PLAYGROUNDS-2  MULTIPURPOSE_GROUND-3
    let sortingOrder = req.body.sortingOrder || "desc"; // asc or desc
    let tabName = req.body.tabName || "ALL_BOOKINGS"; //ALL_BOOKINGS  UPCOMING  HISTORY

    console.log("req body params", {userId, facilityTypeId, sortingOrder, tabName, bookingStatus});
    let upcomingWhereCondition = '';
    // search query for facility bookings
    let searchQuery = `select 
      fb.facilityBookingId as bookingId, f.facilityId as Id, f2.facilityTypeId as typeId, f.facilityname as name, f2.description as type, f.address as location, fb.startDate,
      fb.endDate, s.statusCode, fb.sportsName, fb.bookingDate, fb.createdOn as createdDate
    from amabhoomi.facilitybookings fb
    inner join amabhoomi.facilities f on f.facilityId = fb.facilityId
    inner join amabhoomi.facilitytypes f2 on f.facilityTypeId = f2.facilitytypeId
    inner join amabhoomi.statusmasters s on s.statusId = fb.statusId
    where fb.createdBy = ${userId}
    ${upcomingWhereCondition}
    OR (${fromDate} IS NULL OR CAST(fb.createdOn as DATE) >= CAST(${fromDate} as DATE))
    OR (${toDate} IS NULL OR CAST(fb.createdOn as DATE) <= CAST(${toDate} as DATE))
    OR (s.statusId IN (${bookingStatus}))
    OR (f2.facilityTypeId IN (${facilityTypeId}))
    order by fb.createdOn ${sortingOrder}`;


    // search query for live event booking
    let searchQueryEvents = `select 
      fb.eventBookingId as bookingId, f.eventId as Id, f.eventName as name, f.eventCategoryId, f.locationName as location, 
      fb.bookingDate, s.statusCode, 'EVENTS' as type, '6' as typeId, fb.createdOn as createdDate
    from amabhoomi.eventbookings fb
    inner join amabhoomi.eventactivities f on f.eventId = fb.eventId
    inner join amabhoomi.facilities f2 on f.facilityId = f2.facilityId
    inner join amabhoomi.statusmasters s on s.statusId = fb.statusId
    where fb.createdBy = ${userId}
    ${upcomingWhereCondition}
    OR (${fromDate} IS NULL OR CAST(fb.createdOn as DATE) >= CAST(${fromDate} as DATE))
    OR (${toDate} IS NULL OR CAST(fb.createdOn as DATE) <= CAST(${toDate} as DATE))
    OR (s.statusId IN (${bookingStatus}))
    OR (f2.facilityTypeId IN (${facilityTypeId}))
    order by fb.createdOn ${sortingOrder}`;

    // search query for event host booking
    let searchQueryEventHostRequest = `select 
      fb.hostBookingId as bookingId, f.hostId as Id, e.eventName as name, e.eventCategoryId, 
      ecm.eventCategoryName, f2.facilityname, e.locationName as location, e.eventDate, 
      fb.bookingDate, s.statusCode, fb.bookingDate, 
      'EVENT_HOST_REQUEST' as type, '7' as typeId, fb.createdOn as createdDate
    from amabhoomi.hostbookings fb
    inner join amabhoomi.hosteventdetails f on f.hostId = fb.hostId 
    inner join amabhoomi.eventactivities e on e.eventId = f.eventId
    inner join amabhoomi.facilities f2 on f2.facilityId = e.facilityId
    inner join amabhoomi.statusmasters s on s.statusId = fb.statusId
    inner join amabhoomi.eventcategorymasters ecm on ecm.eventCategoryId = e.eventCategoryId
    where fb.createdBy = ${userId}
    ${upcomingWhereCondition}
    OR (${fromDate} IS NULL OR CAST(fb.createdOn as DATE) >= CAST(${fromDate} as DATE))
    OR (${toDate} IS NULL OR CAST(fb.createdOn as DATE) <= CAST(${toDate} as DATE))
    OR (s.statusId IN (${bookingStatus}))
    OR (f2.facilityTypeId IN (${facilityTypeId}))
    order by fb.createdOn ${sortingOrder}`;

    if (tabName == "ALL_BOOKINGS") {
      console.log(11)
      let searchQueryResult = await sequelize.query(searchQuery, {
        type: Sequelize.QueryTypes.SELECT,
      });
      // console.log("searchQueryResult", searchQueryResult);

      console.log(22, searchQueryResult.length);
      let searchEventQueryResult = await sequelize.query(searchQueryEvents, {
        type: Sequelize.QueryTypes.SELECT,
      });

      console.log(33, searchEventQueryResult.length)
      let searchEventHostQueryResult = await sequelize.query(searchQueryEventHostRequest, {
        type: Sequelize.QueryTypes.SELECT,
      });

      console.log(44, searchEventHostQueryResult.length)
      let modifiedResultArray = [];

      if(facilityTypeId) {  // if facility type is selected, then show data as per facility type
        facilityTypeId = facilityTypeId.split(',');
        console.log("facilityTypeId", facilityTypeId);
        if(facilityTypeId.includes('6')) {  // event type filter selected
          console.log(51)
          modifiedResultArray = [...modifiedResultArray, ...searchEventQueryResult];
        }
        if(facilityTypeId.includes('7')) {  // event host type filter selected
          console.log(52)
          modifiedResultArray = [...modifiedResultArray, ...searchEventHostQueryResult];
        }
        if(facilityTypeId.includes('1') || facilityTypeId.includes('2') || facilityTypeId.includes('3')) {  // parks, playgrounds, mp grounds filter type selected
          console.log(53)
          modifiedResultArray = [...modifiedResultArray, ...searchQueryResult];
        }
      }
      else {  // if facility type not selected, then show all data
        modifiedResultArray = [
          ...searchQueryResult,
          ...searchEventQueryResult,
          ...searchEventHostQueryResult
        ];
      }
      
      modifiedResultArray = modifiedResultArray.sort((a, b) => {
        return new Date(b.bookingDate) - new Date(a.bookingDate);
      });

      // console.log("searchEventQueryResult", searchEventQueryResult);

      if (searchQueryResult.length == 0 && searchEventQueryResult.length == 0 && searchEventHostQueryResult.length == 0) {
        res.status(statusCode.NOTFOUND.code).json({
          message:
            "No bookings data found for parks, playgrounds, multi-grounds or event host requests.",
          data: [],
        });
      } else {
        res.status(statusCode.SUCCESS.code).json({
          message: "All bookings of parks, playgrounds, multi-grounds",
          data: modifiedResultArray,
        });
      }
    }
    else if (tabName == "UPCOMING") {
      upcomingWhereCondition = "and CONCAT(fb.bookingDate , ' ', fb.startDate) > CONVERT_TZ(NOW(), @@session.time_zone, 'SYSTEM')";
      let searchQueryResult = await sequelize.query(searchQuery, {
        type: Sequelize.QueryTypes.SELECT,
      });
      console.log("searchQueryResult", searchQueryResult);

      let searchEventQueryResult = await sequelize.query(searchQueryEvents, {
        type: Sequelize.QueryTypes.SELECT,
      });

      let searchEventHostQueryResult = await sequelize.query(searchQueryEventHostRequest, {
        type: Sequelize.QueryTypes.SELECT,
      });

      if(facilityTypeId) {  // if facility type is selected, then show data as per facility type
        facilityTypeId = facilityTypeId.split(',');
        console.log("facilityTypeId", facilityTypeId);
        if(facilityTypeId.includes('6')) {  // event type filter selected
          console.log(51)
          modifiedResultArray = [...modifiedResultArray, ...searchEventQueryResult];
        }
        if(facilityTypeId.includes('7')) {  // event host type filter selected
          console.log(52)
          modifiedResultArray = [...modifiedResultArray, ...searchEventHostQueryResult];
        }
        if(facilityTypeId.includes('1') || facilityTypeId.includes('2') || facilityTypeId.includes('3')) {  // parks, playgrounds, mp grounds filter type selected
          console.log(53)
          modifiedResultArray = [...modifiedResultArray, ...searchQueryResult];
        }
      }
      else {  // if facility type not selected, then show all data
        modifiedResultArray = [
          ...searchQueryResult,
          ...searchEventQueryResult,
          ...searchEventHostQueryResult
        ];
      }

      modifiedResultArray = modifiedResultArray.sort((a, b) => {
        return new Date(b.bookingDate) - new Date(a.bookingDate);
      });

      console.log("searchEventQueryResult", searchEventQueryResult);

      if (searchQueryResult.length == 0 && searchEventQueryResult.length == 0 && searchEventHostQueryResult.length == 0) {
        res.status(statusCode.NOTFOUND.code).json({
          message:
            "No bookings data found for parks, playgrounds, multi-grounds or event host requests.",
          data: [],
        });
      } else {
        res.status(statusCode.SUCCESS.code).json({
          message: "All bookings of parks, playgrounds, multi-grounds",
          data: modifiedResultArray,
        });
      }
    } 
    else if (tabName == "HISTORY") {
      upcomingWhereCondition = "and CONCAT(fb.bookingDate , ' ', fb.startDate) < CONVERT_TZ(NOW(), @@session.time_zone, 'SYSTEM')";
      let searchQueryResult = await sequelize.query(searchQuery, {
        type: Sequelize.QueryTypes.SELECT,
      });
      console.log("searchQueryResult", searchQueryResult);

      let searchEventQueryResult = await sequelize.query(searchQueryEvents, {
        type: Sequelize.QueryTypes.SELECT,
      });

      let searchEventHostQueryResult = await sequelize.query(searchQueryEventHostRequest, {
        type: Sequelize.QueryTypes.SELECT,
      });

      if(facilityTypeId) {  // if facility type is selected, then show data as per facility type
        facilityTypeId = facilityTypeId.split(',');
        console.log("facilityTypeId", facilityTypeId);
        if(facilityTypeId.includes('6')) {  // event type filter selected
          console.log(51)
          modifiedResultArray = [...modifiedResultArray, ...searchEventQueryResult];
        }
        if(facilityTypeId.includes('7')) {  // event host type filter selected
          console.log(52)
          modifiedResultArray = [...modifiedResultArray, ...searchEventHostQueryResult];
        }
        if(facilityTypeId.includes('1') || facilityTypeId.includes('2') || facilityTypeId.includes('3')) {  // parks, playgrounds, mp grounds filter type selected
          console.log(53)
          modifiedResultArray = [...modifiedResultArray, ...searchQueryResult];
        }
      }
      else {  // if facility type not selected, then show all data
        modifiedResultArray = [
          ...searchQueryResult,
          ...searchEventQueryResult,
          ...searchEventHostQueryResult
        ];
      }
      
      modifiedResultArray = modifiedResultArray.sort((a, b) => {
        return new Date(b.bookingDate) - new Date(a.bookingDate);
      });

      console.log("searchEventQueryResult", searchEventQueryResult);

      if (searchQueryResult.length == 0 && searchEventQueryResult.length == 0 && searchEventHostQueryResult.length == 0) {
        res.status(statusCode.NOTFOUND.code).json({
          message:
            "No bookings data found for parks, playgrounds, multi-grounds or event host requests.",
          data: [],
        });
      } else {
        res.status(statusCode.SUCCESS.code).json({
          message: "All bookings of parks, playgrounds, multi-grounds",
          data: modifiedResultArray,
        });
      }
    }
  } catch (error) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: error.message });
  }
};

let initalFilterDataForBooking = async (req, res) => {
  try {
    let facilityTypeQueryResult = await facilityTypeMaster.findAll();

    let statusCodeMasterQueryResult = await statusCodeMaster.findAll({
      where: {
        parentStatusCode: {
          [Sequelize.Op.in]: ["BOOKING_STATUS", "HOSTING_STATUS"],
        },
      },
    });

    // console.log("search results", {
    //   facilityTypeQueryResult,
    //   statusCodeMasterQueryResult,
    // });

    res.status(statusCode.SUCCESS.code).json({
      message: "Initial filter data for Booking Details section",
      data: { facilityTypeQueryResult, statusCodeMasterQueryResult },
    });
  } catch (error) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: error.message });
  }
};

let bookmarkingAddAction = async (req, res) => {
  try {
    let userId = req.user?.userId || 9;
    let facilityId = req.body.facilityId || null;
    let eventId = req.body.eventId || null;

    console.log({ facilityId, eventId, userId });
    if (facilityId) {
      const existingUserBookmark = await bookmarks.findOne({
        where: {
          facilityId: facilityId,
          publicUserId: userId,
        }
      });
      console.log(1)
      console.log('existing facility bookmark', existingUserBookmark?.bookmarkId);
      console.log(2)
      if (existingUserBookmark?.bookmarkId) {
        const [bookmarkUpdate] = await bookmarks.update(
          { statusId: 1, updatedOn: new Date(), updatedBy: userId },
          { where: { bookmarkId: existingUserBookmark.bookmarkId } }
        );

        if (bookmarkUpdate > 0) {
          res.status(statusCode.SUCCESS.code).json({
            message: 'Bookmark added successfully!'
          });
        }
        else {
          res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: 'Bookmarking failed! Please try again.'
          });
        }
      }
      else {
        const newUserBookmark = await bookmarks.create({
          publicUserId: userId,
          facilityId: facilityId,
          statusId: 1,
          createdDt: new Date(),
          createdBy: userId,
        });

        console.log("newUserBookmark", newUserBookmark);
        res.status(statusCode.SUCCESS.code).json({
          message: "New bookmark added!",
        });
      }
    } else if (eventId) {

      const existingUserBookmark = await bookmarks.findOne({
        where: {
          eventId: eventId,
          publicUserId: userId
        }
      });

      console.log('existing event bookmark', existingUserBookmark.bookmarkId);

      if (existingUserBookmark.bookmarkId) {
        const [bookmarkUpdate] = await bookmarks.update(
          { statusId: 1 },
          { where: { bookmarkId: existingUserBookmark.bookmarkId } }
        );

        if (bookmarkUpdate > 0) {
          res.status(statusCode.SUCCESS.code).json({
            message: 'Bookmark added successfully!'
          });
        }
        else {
          res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: 'Bookmarking failed! Please try again.'
          });
        }
      }
      else {
        const newUserBookmark = await bookmarks.create({
          publicUserId: userId,
          eventId: eventId,
          statusId: 1,
          createdDt: new Date(),
          createdBy: userId,
        });

        console.log("newUserBookmark", newUserBookmark);
        res.status(statusCode.SUCCESS.code).json({
          message: "New bookmark added!",
        });
      }
    } else {
      res.status(statusCode.BAD_REQUEST.code).json({
        message: "Bookmarking failed!",
      });
    }
  } catch (error) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: error.message });
  }
};

let bookmarkingRemoveAction = async (req, res) => {
  try {
    let userId = req.user?.userId || 1;
    let bookmarkId = req.body.bookmarkId;
    let facilityId = req.body.facilityId;
    let eventId = req.body.eventId;

    const [numUpdated] = await bookmarks.update(
      { statusId: 2 },
      { where: { bookmarkId: bookmarkId } }
    );

    if (numUpdated > 0) {
      res.status(statusCode.SUCCESS.code).json({
        message: "Bookmark removed!",
      });
    } else {
      res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: "Bookmark removal failed!",
      });
    }
  } catch (error) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: error.message });
  }
};

let viewBookmarksListForUser = async (req, res) => {
  try {
    let userId = req.user?.userId || 1;
    let facilityType = req.body.facilityType; //EVENTS   PARKS  PLAYGROUNDS   MULTIPURPOSE_GROUND
    let fromDate = req.body.fromDate
      ? new Date(req.body.fromDate)
      : null || null;
    let toDate = req.body.toDate ? new Date(req.body.toDate) : null || null;

    console.log({ userId, facilityType, fromDate, toDate });

    let fetchBookmarkListForFacilitiesQuery = `  
      select
        p.bookmarkId, f.facilityId as id, f.facilityname as name, f.address, p.publicUserId as userid,
        f2.description as facilityType, f2.facilitytypeId, p.createdOn as bookmarkDate, f4.url, s.statusCode
      from amabhoomi.publicuserbookmarks p
      inner join amabhoomi.facilities f on p.facilityId = f.facilityId
      inner join amabhoomi.statusmasters s on s.statusId = p.statusId and s.parentStatusCode = 'RECORD_STATUS'
      inner join amabhoomi.facilitytypes f2 on f2.facilitytypeId = f.facilityTypeId
      left join amabhoomi.fileattachments f3 on f3.entityId = f.facilityId and f3.entityType = 'facilities' and f3.filePurpose = 'singleFacilityImage'
      left join amabhoomi.files f4 on f3.fileId = f4.fileId
      where p.publicUserId = 9
      and s.statusCode = 'ACTIVE'
      group by p.bookmarkId, f.facilityId, f.facilityname, f.address, p.publicUserId, f2.description, f2.facilitytypeId, p.createdOn, f4.url, s.statusCode
    `;

    let fetchBookmarkListForEventsQuery = `
      select
        p.bookmarkId, e.eventName as name, e.eventId as id, e.locationName as address, e.eventDate, 
        'Event' as facilityType, p.createdOn as bookmarkDate, f4.url, s.statusCode
      from amabhoomi.publicuserbookmarks p
      inner join amabhoomi.eventactivities e on p.eventId = e.eventId
      inner join amabhoomi.statusmasters s on s.statusId = p.statusId and s.parentStatusCode = 'RECORD_STATUS'
      left join amabhoomi.fileattachments f3 on f3.entityId = e.eventId and f3.entityType = 'events'
      left join amabhoomi.files f4 on f3.fileId = f4.fileId
      where p.publicUserId = ?
      AND (? IS NULL OR CAST(p.createdOn as DATE) >= CAST(? as DATE))
      AND (? IS NULL OR cast(p.createdOn as DATE) <= CAST(? as DATE))
      and s.statusCode = 'ACTIVE'
    `;

    // run query to fetch facility bookmarks and event bookmarks
    let searchQueryResult = await sequelize.query(
      fetchBookmarkListForFacilitiesQuery,
      {
        replacements: [userId, fromDate, fromDate, toDate, toDate],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    let searchEventResult = await sequelize.query(
      fetchBookmarkListForEventsQuery,
      {
        replacements: [userId, fromDate, fromDate, toDate, toDate],
        type: Sequelize.QueryTypes.SELECT,
      }
    )

    res.status(statusCode.SUCCESS.code).json({
      message: 'Bookmark list',
      data: [...searchQueryResult.map((facility) => {
        if (facility.url)
          facility.url = encodeURIComponent(facility.url);
        return facility;
      }), ...searchEventResult.map((event) => {
        if (event.url)
          event.url = encodeURIComponent(event.url);
        return event;
      })]
    });

    /*
    if (facilityType != "EVENTS" && facilityType != "EVENT_HOST_REQUEST") {
      //search for PARKS  PLAYGROUNDS   MULTIPURPOSE_GROUND bookmarks
      searchQueryResult = await sequelize.query(
        fetchBookmarkListForFacilitiesQuery,
        {
          replacements: [userId, fromDate, fromDate, toDate, toDate],
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      // console.log('1 searchQueryResult', searchQueryResult);

      res.status(statusCode.SUCCESS.code).json({
        message:
          "Data of all bookmarks for parks, playgrounds, multipurpose grounds",
        data: searchQueryResult,
      });
    } else if (facilityType == "EVENTS") {
      //EVENTS bookmarks
      searchQueryResult = await sequelize.query(
        fetchBookmarkListForEventsQuery,
        {
          replacements: [userId, fromDate, fromDate, toDate, toDate],
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      // console.log('2 searchQueryResult', searchQueryResult);

      res.status(statusCode.SUCCESS.code).json({
        message: "Data of all bookmarks for event booking",
        data: searchQueryResult,
      });
    } else {
      res.status(statusCode.BAD_REQUEST.code).json({
        message: "Please provide filter options.",
        data: [],
      });
    }*/
  } catch (error) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: error.message });
  }
};

let addHostEventRequest = async (req, res) => {
  try {
    let { organisationName, organisationPanCard, organisationAddress } =
      req.body;

    // hosteventdetails
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message,
    });
  }
};

module.exports = {
  viewList,
  createUser,
  updateUserData,
  getUserById,
  fetchInitialData,
  autoSuggestionForUserSearch,
  viewBookings,
  initalFilterDataForBooking,
  bookmarkingAddAction,
  bookmarkingRemoveAction,
  viewBookmarksListForUser,
  verifyOTPHandlerWithGenerateTokenForAdmin
};
