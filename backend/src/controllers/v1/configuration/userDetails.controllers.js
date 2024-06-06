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
const mailToken= require('../../../middlewares/mailToken.middlewares')
const sendEmail = require('../../../utils/generateEmail')

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
        pu.userId, pu.title, pu.fullName, pu.emailId, pu.userName, pu.phoneNo, 
        rm.roleName
        FROM amabhoomi.rolemasters rm
        LEFT JOIN amabhoomi.usermasters pu ON pu.roleId = rm.roleId`;
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
          userData.title.toLowerCase().includes(givenReq) ||
          userData.fullName.toLowerCase().includes(givenReq) ||
          userData.emailId.toLowerCase().includes(givenReq) ||
          userData.userName.toLowerCase().includes(givenReq) ||
          userData.phoneNo.toLowerCase().includes(givenReq) ||
          userData.roleName.toLowerCase().includes(givenReq)
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
      encryptUsername: encryptUserName,
      encryptEmailId: encryptemailId,
      encryptGenderId,
    } = req.body;

    // console.log(title, fullName, userName, mobileNumber, alternateMobileNo, emailId, roleId, statusId, genderId, 'input')
    console.log(req.body, "req.body");

    let password = await generatePassword(8);
    let sentPassword = password;
    let roleId = await decrypt(encryptRole);
    let statusId = await decrypt(encryptStatus);
    let genderId = await decrypt(encryptGenderId);
         
    if(roleId==4){
      return res.status(statusCode.BAD_REQUEST.code).json({message:'Please provide the role id of the BDA staff'})
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

    const createdBy = req.user?.id || 1;
    const updatedBy = req.user?.id || 1;
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
      console.log("req.body", req.body);
      const hashedPassword = await bcrypt.hash(password, 10); // Use 10 rounds for hashing

      console.log(hashedPassword);
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

      console.log(newUser);
     
      let firstField = decrypt(encryptemailId);
      let secondField = decrypt(encryptMobileNumber)
      let Token = await mailToken({firstField,secondField})
      let verifyUrl = process.env.VERIFY_URL+`?token=${Token}`
  
   

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
              email:`${firstField}`,
              subject:"please verify the email for your amabhoomi user creation",
              html:`<p>${message}</p>`
            }
            )
  
            return res
            .status(statusCode.SUCCESS.code)
            .json({ message: "User created successfully  and mail is sent and please verify the mail " });       
           }
            catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:"user created but mail not sent"})
        }
   
    }
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};

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

    console.log('req body', req.body,userId)
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

      console.log('decrypted mobileno',mobileNo )
      if (getUser.phoneNo != mobileNo && mobileNo) {
        console.log(decrypt(getUser.phoneNo),decrypt(mobileNo))
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
    console.log('userID',userId)
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
    let userId = req.user?.id || 1;
    let fromDate = req.body.fromDate
      ? new Date(req.body.fromDate)
      : null || null;
    let toDate = req.body.toDate ? new Date(req.body.toDate) : null || null;
    let bookingStatus = req.body.bookingStatus || null;
    let facilityType = req.body.facilityType || null; //EVENTS-6   EVENT_HOST_REQUEST-7   PARKS -1  PLAYGROUNDS-2  MULTIPURPOSE_GROUND-3
    let facilityTypeId = req.body.facilityTypeId || null;
    let sortingOrder = req.body.sortingOrder || "desc"; // asc or desc
    let tabName = req.body.tabName || "ALL_BOOKINGS"; //ALL_BOOKINGS     HISTORY

    let searchQuery = `select 
        fb.facilityBookingId as bookingId, f.facilityId as Id, f.facilityname as name, f2.description as type, f.address as location, fb.startDate,
        fb.endDate, s.statusCode, fb.sportsName, fb.bookingDate, fb.createdOn as createdDate
      from amabhoomi.facilitybookings fb
      inner join amabhoomi.facilities f on f.facilityId = fb.facilityId
      inner join amabhoomi.facilitytypes f2 on f.facilityTypeId = f2.facilitytypeId
      inner join amabhoomi.statusmasters s on s.statusId = fb.statusId
      where fb.createdBy = ?
      order by fb.createdOn ${sortingOrder}`;

    /**
       * AND (? IS NULL OR CAST(fb.createdOn as DATE) >= CAST(? as DATE))
      AND (? IS NULL OR CAST(fb.createdOn as DATE) <= CAST(? as DATE))
      AND (? IS NULL OR s.statusId = ?)
      AND (? IS NULL OR f2.facilityTypeId = ?)
       */

    let searchQueryEvents = `select 
        fb.eventBookingId as bookingId, f.eventId as Id, f.eventName as name, f.eventCategoryId, f.locationName as location, 
        fb.bookingDate, s.statusCode, 'EVENTS' as type, fb.createdOn as createdDate
      from amabhoomi.eventbookings fb
      inner join amabhoomi.eventactivities f on f.eventId = fb.eventId
      inner join amabhoomi.statusmasters s on s.statusId = fb.statusId
      where fb.createdBy = ?
      order by fb.createdOn ${sortingOrder}`;
    /**
       * 
      AND (? IS NULL OR CAST(fb.createdOn as DATE) >= CAST(? as DATE))
      AND (? IS NULL OR CAST(fb.createdOn as DATE) <= CAST(? as DATE))
      AND (? IS NULL OR s.statusId = ?)
       */

    let searchQueryEventHostRequest = `select 
        fb.hostBookingId as bookingId, f.hostId as Id, e.eventName as name, e.eventCategory, f2.facilityname, e.locationName as location, e.eventDate, 
        fb.bookingDate, s.statusCode, fb.bookingDate, 'EVENT_HOST_REQUEST' as type, fb.createdOn as createdDate
      from amabhoomi.hostbookings fb
      inner join amabhoomi.hosteventdetails f on f.hostId = fb.hostId 
      inner join amabhoomi.eventactivities e on e.eventId = f.eventId
      inner join amabhoomi.facilities f2 on f2.facilityId = e.facilityId
      inner join amabhoomi.statusmasters s on s.statusId = fb.statusId
      where fb.createdBy = ?
      order by fb.createdOn ${sortingOrder}`;

    if (tabName == "ALL_BOOKINGS") {
      let searchQueryResult = await sequelize.query(searchQuery, {
        replacements: [userId],
        type: Sequelize.QueryTypes.SELECT,
      });
      console.log("searchQueryResult", searchQueryResult);

      let searchEventQueryResult = await sequelize.query(searchQueryEvents, {
        replacements: [userId],
        type: Sequelize.QueryTypes.SELECT,
      });

      let modifiedResultArray = [
        ...searchQueryResult,
        ...searchEventQueryResult,
      ];
      modifiedResultArray = modifiedResultArray.sort((a, b) => {
        return new Date(b.bookingDate) - new Date(a.bookingDate);
      });

      console.log("searchEventQueryResult", searchEventQueryResult);

      if (searchQueryResult.length == 0 && searchEventQueryResult.length == 0) {
        res.status(statusCode.NOTFOUND.code).json({
          message:
            "No bookings data found for parks, playgrounds, multi-grounds",
          data: [],
        });
      } else {
        res.status(statusCode.SUCCESS.code).json({
          message: "All bookings of parks, playgrounds, multi-grounds",
          data: modifiedResultArray,
        });
      }
    } else if (tabName == "HISTORY") {
      let searchQueryResult = await sequelize.query(
        searchQueryEventHostRequest,
        {
          replacements: [userId],
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (searchQueryResult.length == 0) {
        res.status(statusCode.NOTFOUND.code).json({
          message: "No bookings data found for event host requests",
          eventHostRequests: [],
        });
      } else {
        res.status(statusCode.SUCCESS.code).json({
          message: "All bookings for event host requests",
          eventHostRequests: searchQueryResult,
        });
      }
    } else {
      res.status(statusCode.BAD_REQUEST.code).json({
        message: "Tab not selected",
      });
    }

    // if (facilityType != 'EVENTS' && facilityType != 'EVENT_HOST_REQUEST') {
    //   searchQueryResult = await sequelize.query(
    //     searchQuery,
    //     {
    //       replacements: [userId, fromDate, fromDate, toDate, toDate, bookingStatus, bookingStatus, facilityTypeId, facilityTypeId],
    //       type: Sequelize.QueryTypes.SELECT
    //     }
    //   );

    //   res.status(statusCode.SUCCESS.code).json({
    //     message: 'Data of all bookings for parks, playgrounds, multipurpose grounds',
    //     data: searchQueryResult
    //   })
    // }
    // else if (facilityType == 'EVENTS') {
    //   searchQueryResult = await sequelize.query(
    //     searchQueryEvents,
    //     {
    //       replacements: [userId, fromDate, fromDate, toDate, toDate, bookingStatus, bookingStatus],
    //       type: Sequelize.QueryTypes.SELECT
    //     }
    //   );

    //   res.status(statusCode.SUCCESS.code).json({
    //     message: 'Data of all bookings for event booking',
    //     data: searchQueryResult
    //   })
    // }
    // else if (facilityType == 'EVENT_HOST_REQUEST'){
    //   searchQueryResult = await sequelize.query(
    //     searchQueryEventHostRequest,
    //     {
    //       replacements: [userId, fromDate, fromDate, toDate, toDate, bookingStatus, bookingStatus],
    //       type: Sequelize.QueryTypes.SELECT
    //     }
    //   );

    //   res.status(statusCode.SUCCESS.code).json({
    //     message: 'Data of all bookings for event host request',
    //     data: searchQueryResult
    //   })
    // }
    // else {
    //   res.status(statusCode.BAD_REQUEST.code).json({
    //     message: 'Please provide filter options.',
    //     data: []
    //   })
    // }
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

    console.log("search results", {
      facilityTypeQueryResult,
      statusCodeMasterQueryResult,
    });

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
    let userId = req.user?.id || 1;
    let facilityId = req.body.facilityId;
    let eventId = req.body.eventId;

    if (facilityId) {
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
    } else if (eventId) {
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
    let userId = req.user?.id || 1;
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
    let userId = req.user?.id || 1;
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
      left join amabhoomi.fileattachments f3 on f3.entityId = f.facilityId and f3.entityType = 'facilities'
      left join amabhoomi.files f4 on f3.fileId = f4.fileId
      where p.publicUserId = ?
      AND (? IS NULL OR CAST(p.createdOn as DATE) >= CAST(? as DATE))
      AND (? IS NULL OR cast(p.createdOn as DATE) <= CAST(? as DATE))
      and s.statusCode = 'ACTIVE'
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
        if(facility.url)
          facility.url = encodeURIComponent(facility.url);
        return facility;
      }), ...searchEventResult.map((event) => {
        if(event.url)
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
};
