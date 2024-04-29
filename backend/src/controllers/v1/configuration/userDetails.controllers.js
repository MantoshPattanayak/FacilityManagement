const { sequelize, Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')
const db = require('../../../models')
const bcrypt = require('bcrypt')
const { decrypt } = require('../../../middlewares/decryption.middlewares')
const {
  encrypt
} = require('../../../middlewares/encryption.middlewares')
const user = db.privateuser
const facilityTypeMaster = db.facilitytype;
const statusCodeMaster = db.statusmaster;
const bookmarks = db.bookmarks;

let autoSuggestionForUserSearch = async (req, res) => {
  try {
    const givenReq = req.query.givenReq ? req.body.givenReq : null;
    // const decryptGivenReq = await decrypt(givenReq).toLowerCase();

    let allUsersDataQuery = `SELECT COUNT(*) OVER() AS totalCount,
    pu.privateUserId, pu.title, pu.fullName, pu.emailId, pu.userName, pu.contactNo, 
    rm.roleName, sm.statusCode
    FROM amabhoomi.rolemasters rm
    LEFT JOIN amabhoomi.privateusers pu ON pu.roleid = rm.id
    INNER JOIN statusmasters sm ON sm.statusId = rm.statusId`;

    let allUsersData = await sequelize.query(allUsersDataQuery, {
      type: Sequelize.QueryTypes.SELECT
    });
    // Decrypt all encrypted fields
    let decryptedUsers = allUsersData.map(async (userData) => ({
      ...userData,
      title: await decrypt(userData.title),
      fullName: await decrypt(userData.fullName),
      emailId: await decrypt(userData.emailId),
      userName: await decrypt(userData.userName),
      contactNo: await decrypt(userData.contactNo)
    }));

    let matchedSuggestions = decryptedUsers;

    if (givenReq) {
      matchedSuggestions = decryptedUsers.filter(userData =>
        userData.privateUserId.includes(givenReq) ||
        userData.title.toLowerCase().includes(givenReq) ||
        userData.fullName.toLowerCase().includes(givenReq) ||
        userData.emailId.toLowerCase().includes(givenReq) ||
        userData.userName.toLowerCase().includes(givenReq) ||
        userData.contactNo.toLowerCase().includes(givenReq) ||
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
      message: 'All users data',
      data: matchedSuggestions
    });
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message });
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
        pu.privateUserId, pu.title, pu.fullName, pu.emailId, pu.userName, pu.contactNo, 
        rm.roleName
        FROM amabhoomi.rolemasters rm
        LEFT JOIN amabhoomi.privateusers pu ON pu.roleId = rm.roleId`;
    // , sm.statusCode
    // INNER JOIN statusmasters sm ON sm.statusId = rm.statusId

    let getAllUsers = await sequelize.query(getAllUsersQuery, {
      type: Sequelize.QueryTypes.SELECT
    });
    console.log(getAllUsers, 'getAllUsers');
    // let givenReqDecrypted = await decrypt(givenReqEncrypted).toLowerCase() 

    // Decrypt all encrypted fields
    let decryptedUsers = await Promise.all(getAllUsers.map(async (userData) => {
      if (!userData || !userData.title || !userData.fullName || !userData.emailId || !userData.userName || !userData.contactNo) {
        return userData; // Skip decryption if userData or its fields are null or undefined
      }
      return {
        ...userData,
        title: await decrypt(userData.title),
        fullName: await decrypt(userData.fullName),
        emailId: await decrypt(userData.emailId),
        userName: await decrypt(userData.userName),
        contactNo: await decrypt(userData.contactNo)
      }
    }));

    console.log('g')
    console.log(decryptedUsers, 'decryptedUsers')
    // Filter data based on the encrypted search term
    let filteredUsers = decryptedUsers;

    console.log('5')
    if (givenReq) {
      givenReq = givenReq.toLowerCase();

      filteredUsers = decryptedUsers.filter(userData =>
        userData.title.toLowerCase().includes(givenReq) ||
        userData.fullName.toLowerCase().includes(givenReq) ||
        userData.emailId.toLowerCase().includes(givenReq) ||
        userData.userName.toLowerCase().includes(givenReq) ||
        userData.contactNo.toLowerCase().includes(givenReq) ||
        userData.roleName.toLowerCase().includes(givenReq)
        // ||
        // userData.statusCode.toLowerCase().includes(givenReq)
      );
    }
    console.log('filteruser', filteredUsers)

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
      message: 'All users data',
      data: paginatedUsers
    });
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message });
  }
};

let generatePassword = async (length) => {
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = ""
  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  return password
}

let createUser = async (req, res) => {
  try {

    const pwdFlag = false;


    const { title, fullName, userName, mobileNumber, alternateMobileNo, emailId, roleId, statusId, genderId } = req.body;

    console.log(title, fullName, userName, mobileNumber, alternateMobileNo, emailId, roleId, statusId, genderId, 'input')

    let password = await generatePassword(8)

    const encryptTitle = await encrypt(title);
    const encryptfullName = await encrypt(fullName);
    const encryptUserName = await encrypt(userName);
    const encryptMobileNumber = await encrypt(mobileNumber);
    const encryptAlternateMobileNumber = await encrypt(alternateMobileNo);
    const encryptemailId = await encrypt(emailId);

    console.log("1", encryptTitle, encryptfullName, encryptMobileNumber, encryptAlternateMobileNumber)

    const createdBy = req.user?.id || 1;
    const updatedBy = req.user?.id || 1;
    console.log('1')
    const existingUserMobile = await user.findOne({ where: { contactNo: encryptMobileNumber } });
    const existingUserEmail = await user.findOne({ where: { emailId: encryptemailId } });
    const existingUserName = await user.findOne({ where: { userName: encryptUserName } });
    const existingAlternateUserMobile = await user.findOne({ where: { contactNo: encryptAlternateMobileNumber } });

    if (existingUserMobile) {
      return res.status(statusCode.CONFLICT.code).json({ message: "User already exist same contact_no" })
    } else if (existingUserEmail) {
      return res.status(statusCode.CONFLICT.code).json({ message: "User already exist same email_id" })
    } else if (existingUserName) {
      return res.status(statusCode.CONFLICT.code).json({ message: "User already exist same user_name" })
    }
    else if (existingAlternateUserMobile) {
      return res.status(statusCode.CONFLICT.code).json({ message: "User already exist with given alternate contact no " })

    } else {
      console.log('req.body', req.body)
      const hashedPassword = await bcrypt.hash(password, 10); // Use 10 rounds for hashing

      console.log(hashedPassword)
      const newUser = await user.create({
        title: encryptTitle, fullName: encryptfullName, contactNo: encryptMobileNumber, emailId: encryptemailId,
        userName: encryptUserName, password: hashedPassword, changePwdFlag: pwdFlag,
        roleId: roleId, statusId: statusId, genderId: genderId,
        alterateContactNo: alternateMobileNo,
        createdDt: new Date(), createdBy: createdBy, updatedDt: new Date(), updatedBy: updatedBy
      });

      console.log(newUser)

      return res.status(statusCode.SUCCESS.code).json({ message: "User created successfully " });
    }
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message })

  }

}


let updateUserData = async (req, res) => {
  try {
    const { userId, title, fullName, userName, mobileNumber, alternateMobileNo, emailId, roleId, statusId, genderId } = req.body   //await decrypt(req.body);


    const encryptTitle = await encrypt(title);
    const encryptfullName = await encrypt(fullName);
    const encryptUserName = await encrypt(userName);
    const encryptMobileNumber = await encrypt(mobileNumber);
    const encryptemailId = await encrypt(emailId);
    const encryptAlternateMobileNo = await encrypt(alternateMobileNo)
    let updatedValueObject = {};

    const getUser = await user.findOne({
      where: {
        privateUserId: userId
      }
    })
    console.log(getUser, 'getUser')
    if (getUser) {
      if (await decrypt(getUser.dataValues.fullName) != fullName) {
        updatedValueObject.fullName = encryptfullName
      }
      if (await decrypt(getUser.userName) != userName) {
        let checkIsUsernameAlreadyPresent = await user.findOne({
          where: {
            contactNo: encryptUserName
          }
        })
        if (checkIsUsernameAlreadyPresent) {
          return res.status(statusCode.CONFLICT.code).json({
            message: "This username is already existing "
          })
        }
        updatedValueObject.userName = encryptUserName
      }
      if (await decrypt(getUser.contactNo) != mobileNumber) {
        let checkIsMobileAlreadyPresent = await user.findOne({
          where: {
            contactNo: encryptMobileNumber
          }
        })
        if (checkIsMobileAlreadyPresent) {
          return res.status(statusCode.CONFLICT.code).json({
            message: "This mobile no is already assigned to a existing user"
          })
        }
        updatedValueObject.mobileNo = encryptMobileNumber
      }

      if (await decrypt(getUser.contactNo) != alternateMobileNo) {
        let checkIsAlternateMobileAlreadyPresent = await user.findOne({
          where: {
            contactNo: encryptAlternateMobileNo
          }
        })
        if (checkIsAlternateMobileAlreadyPresent) {
          return res.status(statusCode.CONFLICT.code).json({
            message: "This mobile no is already assigned to a existing user"
          })
        }
        updatedValueObject.mobileNo = encryptMobileNumber
      }
      if (await decrypt(getUser.title) != title) {
        updatedValueObject.title = encryptTitle
      }
      if (await decrypt(getUser.dataValues.emailId) != emailId && emailId != null) {

        let checkIsEmailAlreadyPresent = await user.findOne({
          where: {
            emailId: encryptemailId
          }
        })
        if (checkIsEmailAlreadyPresent) {
          return res.status(statusCode.CONFLICT.code).json({
            message: "This email id is already assigned to a existing user"
          })
        }
        updatedValueObject.emailId = encryptemailId
      }
      if (getUser.roleId != roleId) {
        updatedValueObject.roleId = roleId
      }
      if (getUser.statusId != statusId) {
        updatedValueObject.statusId = statusId
      }
      if (getUser.gender != genderId) {
        updatedValueObject.gender = genderId
      }

      let [updatedValueCounts, updatedMetaData] = await user.update(updatedValueObject, {
        where: {
          privateUserId: getUser.privateUserId
        }
      })
      if (updatedValueCounts > 0) {
        return res.status(statusCode.SUCCESS.code).json({ message: "User record is updated successfully" })

      }
      return res.status(statusCode.FORBIDDEN.code).json({ message: "User record is updated successfully" })


    }
    else {
      return res.status(statusCode.BAD_REQUEST.code).json({ message: "This user doesn't  exist in our record" })

    }


  }
  catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message })

  }
}

let getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    let specificUser = await sequelize.query(`select title,fullName,emailId,userName,contactNo,roleId,statusId,genderId from amabhoomi.privateusers where privateuserid= ?`, {
      replacements: [userId], // Pass the parameter value as an array
      type: Sequelize.QueryTypes.SELECT
    }
    );

    //    let userEncryptedData = specificUser.map(async(user)=>({
    //         title: await encrypt(user.title),
    //         fullName:await encrypt(user.fullName),
    //         emailId:await encrypt(user.emailId),
    //         userName:await encrypt(user.userName),
    //         contactNo:await encrypt(user.contactNo),
    //         roleId:roleId,
    //         statusId:statusId,
    //         genderId:genderId

    // }))

    return res.status(statusCode.SUCCESS.code).json({ message: "Required User", data: specificUser });
  }
  catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message })

  }
}

let fetchInitialData = async (req, res) => {
  try {
    let roleData = await sequelize.query(`select  roleId, roleCode, roleName from amabhoomi.rolemasters `, { type: Sequelize.QueryTypes.SELECT })

    let statusData = await sequelize.query(`select statusId,statusCode, description from amabhoomi.statusmasters`, { type: Sequelize.QueryTypes.SELECT })

    let genderData = await sequelize.query(`select genderId, genderCode, genderName from amabhoomi.gendermasters`, { type: Sequelize.QueryTypes.SELECT })

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
      gender: genderData
    })

  }
  catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message })

  }
}

let viewBookings = async (req, res) => {
  try {
    let userId = req.user?.id || 1;
    let fromDate = new Date(req.body.fromDate) || new Date();
    let toDate = new Date(req.body.toDate) || new Date();
    let bookingStatus = req.body.bookingStatus || null;
    let facilityType = req.body.facilityType || null; //EVENTS    EVENT_HOST_REQUEST   PARKS  PLAYGROUNDS   MULTIPURPOSE_GROUND
    let sortingOrder = req.body.sortingOrder || 'desc';  // asc or desc

    let searchQuery =
      `select 
        f.facilityname, f2.description as facilityType, f.address, fb.startDate,
        fb.endDate, s.statusCode, fb.sportsName, s2.statusCode as paymentStatus
      from amabhoomi.facilitybookings fb
      inner join amabhoomi.facilities f on f.facilityId = fb.facilityId
      inner join amabhoomi.facilitytypes f2 on f.facilityTypeId = f2.facilitytypeId
      inner join amabhoomi.publicusers p on p.publicUserId = fb.createdBy
      inner join amabhoomi.statusmasters s on s.statusId = fb.statusId
      inner join amabhoomi.statusmasters s2 on s2.statusId = fb.paymentstatus
      where p.publicUserId = ?
      AND (? IS NULL OR CAST(fb.createdOn as DATE) >= CAST(? as DATE))
      AND (? IS NULL OR CAST(fb.createdOn as DATE) <= CAST(? as DATE))
      AND (? IS NULL OR s.statusId = ?)
      AND (? IS NULL OR f2.facilityTypeId = ?)
      order by fb.createdOn ${sortingOrder}`;

    let searchQueryEvents =
      `select 
        f.eventName, f.eventCategory, f.locationName, fb.bookingDate, s.statusCode, s2.statusCode as paymentstatus
      from amabhoomi.eventbookings fb
      inner join amabhoomi.eventactivities f on f.eventId = fb.eventId
      inner join amabhoomi.publicusers p on p.publicUserId = fb.createdBy
      inner join amabhoomi.statusmasters s on s.statusId = fb.statusId
      inner join amabhoomi.statusmasters s2 on s2.statusId = fb.paymentstatus
      where p.publicUserId = ?
      AND (? IS NULL OR CAST(fb.createdOn as DATE) >= CAST(? as DATE))
      AND (? IS NULL OR CAST(fb.createdOn as DATE) <= CAST(? as DATE))
      AND (? IS NULL OR s.statusId = ?)
      order by fb.createdOn ${sortingOrder}`;

      let searchQueryEventHostRequest = 
      `select 
        e.eventName, e.eventCategory, f2.facilityname, e.locationName, e.eventDate, 
        fb.bookingDate, s.statusCode, s2.statusCode as paymentstatus
      from amabhoomi.hostbookings fb
      inner join amabhoomi.hosteventdetails f on f.hostId = fb.hostId 
      inner join amabhoomi.eventactivities e on e.eventId = f.eventId
      inner join amabhoomi.facilities f2 on f2.facilityId = e.facilityMasterId
      inner join amabhoomi.publicusers p on p.publicUserId = fb.createdBy
      inner join amabhoomi.statusmasters s on s.statusId = fb.statusId
      inner join amabhoomi.statusmasters s2 on s2.statusId = fb.paymentstatus
      where p.publicUserId = ?
      AND (? IS NULL OR CAST(fb.createdOn as DATE) >= CAST(? as DATE))
      AND (? IS NULL OR CAST(fb.createdOn as DATE) <= CAST(? as DATE))
      AND (? IS NULL OR s.statusId = ?)
      order by fb.createdOn ${sortingOrder}`;

    let searchQueryResult = null;
    console.log('1');

    if (facilityType != 'EVENTS' && facilityType != 'EVENT_HOST_REQUEST' && facilityType) {
      searchQueryResult = await sequelize.query(
        searchQuery,
        {
          replacements: [userId, fromDate, fromDate, toDate, toDate, bookingStatus, bookingStatus, facilityType, facilityType],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      res.status(statusCode.SUCCESS.code).json({
        message: 'Data of all bookings for parks, playgrounds, multipurpose grounds',
        data: searchQueryResult
      })
    }
    else if (facilityType == 'EVENTS') {
      searchQueryResult = await sequelize.query(
        searchQueryEvents,
        {
          replacements: [userId, fromDate, fromDate, toDate, toDate, bookingStatus, bookingStatus],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      res.status(statusCode.SUCCESS.code).json({
        message: 'Data of all bookings for event booking',
        data: searchQueryResult
      })
    }
    else if (facilityType == 'EVENT_HOST_REQUEST'){
      searchQueryResult = await sequelize.query(
        searchQueryEventHostRequest,
        {
          replacements: [userId, fromDate, fromDate, toDate, toDate, bookingStatus, bookingStatus],
          type: Sequelize.QueryTypes.SELECT
        }
      );

      res.status(statusCode.SUCCESS.code).json({
        message: 'Data of all bookings for event host request',
        data: searchQueryResult
      })
    }
    else {
      res.status(statusCode.BAD_REQUEST.code).json({
        message: 'Please provide filter options.',
        data: []
      })
    }
  }
  catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: error.message });
  }
}

let initalFilterDataForBooking = async (req, res) => {
  try {

    let facilityTypeQueryResult = await facilityTypeMaster.findAll();

    let statusCodeMasterQueryResult = await statusCodeMaster.findAll({ 
      where: { 
        parentStatusCode: {
          [Sequelize.Op.in]: ['BOOKING_STATUS', 'HOSTING_STATUS']
        }
      } 
    });

    console.log('search results', {facilityTypeQueryResult, statusCodeMasterQueryResult});

    res.status(statusCode.SUCCESS.code).json({
      message: 'Initial filter data for Booking Details section',
      data: {facilityTypeQueryResult, statusCodeMasterQueryResult}
    })
  }
  catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: error.message });
  }
}

let bookmarkingAddAction = async (req, res) => {
  try {
    let userId = req.user?.id || 1;
    let facilityId = req.body.facilityId;
    let eventId = req.body.eventId;

    if(facilityId) {
      const newUserBookmark = await bookmarks.create({
        publicUserId: userId,
        facilityId: facilityId,
        statusId: 1,
        createdDt: new Date(), 
        createdBy: userId
      });

      console.log('newUserBookmark', newUserBookmark);
      res.status(statusCode.SUCCESS.code).json({
        message: 'New bookmark added!'
      })
    }
    else if(eventId){
      const newUserBookmark = await bookmarks.create({
        publicUserId: userId,
        eventId: eventId,
        statusId: 1,
        createdDt: new Date(), 
        createdBy: userId
      });

      console.log('newUserBookmark', newUserBookmark);
      res.status(statusCode.SUCCESS.code).json({
        message: 'New bookmark added!'
      })
    }
    else {
      res.status(statusCode.BAD_REQUEST.code).json({
        message: 'Bookmarking failed!'
      })
    }
  }
  catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: error.message });
  }
}

let bookmarkingRemoveAction = async (req, res) => {
  try {
    let userId = req.user?.id || 1;
    let bookmarkId = req.body.bookmarkId;
    let facilityId = req.body.facilityId;
    let eventId = req.body.eventId;

    const numUpdated = await bookmarks.update({ statusId: 2 }, { where: { bookmarkId: bookmarkId } });

    if(numUpdated > 0) {
      res.status(statusCode.SUCCESS.code).json({
        message: 'Bookmark removed!'
      })
    }
    else{
      res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: 'Bookmark removal failed!'
      })
    }
  }
  catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: error.message });
  }
}

let viewBookmarksListForUser = async (req, res) => {
  try {
    let userId = req.user?.id || 1;
    let 
  }
  catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: error.message });
  }
}

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
  bookmarkingRemoveAction
}