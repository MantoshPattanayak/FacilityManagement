const db = require("../../../models/index");
let statusCode = require("../../../utils/statusCode");
const public_user = db.publicuser;
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const Sequelize = db.Sequelize;
const bcrypt = require("bcrypt");
const { decrypt } = require("../../../middlewares/decryption.middlewares");
const { encrypt } = require("../../../middlewares/encryption.middlewares");
const { where } = require("sequelize");
const facilityType = db.facilitytype;
const updatepublic_user = async (req, res) => {
  try {
    const {
      publicUserId,
      title,
      firstName,
      middleName,
      lastName,
      userName,
      password,
      phoneNo,
      altPhoneNo,
      emailId,
      profilePicture,
    } = req.body;

    let params = {};
    const existuserName = await user.findOne({
      where: { userName: userName },
    });
    const existingphoneNo = await user.findOne({
      where: { phoneNo: phoneNo },
    });
    const existingaltPhoneNo = await user.findOne({
      where: { altPhoneNo: altPhoneNo },
    });
    const existingemailId = await user.findOne({
      where: { emailId: emailId },
    });

    if (existuserName) {
      return res
        .status(statusCode.CONFLICT.code)
        .json({ message: "User already exist same userName" });
    } else if (existingphoneNo) {
      return res
        .status(statusCode.CONFLICT.code)
        .json({ message: "User already exist same phoneNo" });
    } else if (existingaltPhoneNo) {
      return res
        .status(statusCode.CONFLICT.code)
        .json({ message: "User already exist same altPhoneNo" });
    } else if (existingemailId) {
      return res.status(statusCode.CONFLICT.code).json({
        message: "User already exist with given emailId",
      });
    }
    let findPublicuserWithTheGivenId = await public_user.findOne({
      where: {
        publicUserId: publicUserId,
      },
    });
    if (findPublicuserWithTheGivenId.title != title) {
      params.title = title;
    } else if (findPublicuserWithTheGivenId.firstName != firstName) {
      params.firstName = firstName;
    } else if (findPublicuserWithTheGivenId.middleName != middleName) {
      params.middleName = middleName;
    } else if (findPublicuserWithTheGivenId.lastName != lastName) {
      params.lastName = lastName;
    } else if (findPublicuserWithTheGivenId.userName != userName) {
      params.userName = userName;
    } else if (findPublicuserWithTheGivenId.password != password) {
      params.password = password;
    } else if (findPublicuserWithTheGivenId.phoneNo != phoneNo) {
      params.phoneNo = phoneNo;
    } else if (findPublicuserWithTheGivenId.altPhoneNo != altPhoneNo) {
      params.altPhoneNo = altPhoneNo;
    } else if (findPublicuserWithTheGivenId.emailId != emailId) {
      params.emailId = emailId;
    }
    let [updatepublicUserCount, updatepublicUserData] =
      await public_user.update(params, {
        where: { publicUserId: publicUserId },
      });

    if (updatepublicUserCount >= 0) {
      return res.status(statusCode.SUCCESS.code).json({
        message: "Updated Successfully",
      });
    } else {
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: "Not Updated ",
      });
    }
    console.log(updatepublicUserData, "skbskb", updatepublicUserCount);
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//findAll
// const viewpublic_user = async (req, res) => {
//   try {
//     let limit = req.body.page_size ? req.body.page_size : 50;
//     let page = req.body.page_number ? req.body.page_number : 1;
//     let offset = (page - 1) * limit;
//     let showAllpublic_user = await public_user.findAll({});

//     let givenReq = req.body.givenReq ? req.body.givenReq : null;
//     if (givenReq) {
//       showAllpublic_user = showAllpublic_user.filter(
//         (public_userData) =>
//           public_userData.publicUserId.includes(givenReq) ||
//           public_userData.title.includes(givenReq) ||
//           public_userData.firstName.includes(givenReq) ||
//           public_userData.middleName.includes(givenReq) ||
//           public_userData.lastName.includes(givenReq) ||
//           public_userData.updatepublic_user.includes(givenReq) ||
//           public_userData.password.includes(givenReq) ||
//           public_userData.phoneNo.includes(givenReq) ||
//           public_userData.altPhoneNo.includes(givenReq) ||
//           public_userData.emailId.includes(givenReq) ||
//           public_userData.profilePicture.includes(givenReq) ||
//           public_userData.lastLogin.includes(givenReq) ||
//           public_userData.googleId.includes(givenReq) ||
//           public_userData.facebookId.includes(givenReq)
//       );
//     }
//     let paginatedShowAllspublic_user = showAllpublic_user.slice(
//       offset,
//       limit + offset
//     );
//     return res.status(statusCode.SUCCESS.code).json({
//       message: "Show All public_user",
//       public_user: paginatedShowAllspublic_user,
//     });
//   } catch (err) {
//     return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
//       message: err.message,
//     });
//   }
// };

//findOne
const viewpublicUser = async (req, res) => {
  console.log("view user profile details");
  try {
    let limit = req.body.page_size ? req.body.page_size : 50;
    let page = req.body.page_number ? req.body.page_number : 1;
    let offset = (page - 1) * limit;
    let userId = req.user?.id || 1;

    let showpublic_user = await public_user.findOne({
      where: {
        publicUserId: userId,
      },
    });

    // let givenReq = req.body.givenReq ? req.body.givenReq : null;
    // if (givenReq) {
    //   showpublic_user = showpublic_user.filter(
    //     (public_userData) =>
    //       public_userData.publicUserId.includes(givenReq) ||
    //       public_userData.title.includes(givenReq) ||
    //       public_userData.firstName.includes(givenReq) ||
    //       public_userData.middleName.includes(givenReq) ||
    //       public_userData.lastName.includes(givenReq) ||
    //       public_userData.updatepublic_user.includes(givenReq) ||
    //       public_userData.password.includes(givenReq) ||
    //       public_userData.phoneNo.includes(givenReq) ||
    //       public_userData.altPhoneNo.includes(givenReq) ||
    //       public_userData.emailId.includes(givenReq) ||
    //       public_userData.profilePicture.includes(givenReq) ||
    //       public_userData.lastLogin.includes(givenReq)
    //   );
    // }
    // let paginatedShowpublic_user = showpublic_user.slice(
    //   offset,
    //   limit + offset
    // );
    return res.status(statusCode.SUCCESS.code).json({
      message: "Show Public User",
      public_user: showpublic_user,
    });
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: err.message,
    });
  }
};
const homePage = async (req, res) => {
  try {
    console.log("12jhkfdj");
    // 1) fetch data w.r.t nearby location and facility
    // 2) fetch facility w.r.t to the playgrounds,parks,multipurpose grounds, Greenways,waterways
    // 3) show the map data with respect to parks, playgrounds,multipurposegrounds, greenways, waterways show the facility near by and search facility,name,locality
    // 4)show the notifications
    // 5)Current events
    // 6) explore new activities for all
    // 7) Gallery images for all
    let givenReq = req.body.givenReq ? req.body.givenReq : null;

    let fetchAllTypeOFFacility = await facilityType.findAll({
      attributes: ["facilitytypeId", "code", "description"],

      where: {
        statusId: 1,
      },
    });

    let fetchEventDetailsQuery = `select eventName, eventCategory,locationName,eventDate,eventStartTime,
    eventEndTime, descriptionOfEvent from amabhoomi.eventactivities where ticketSalesEnabled =1 `;

    let fetchEventDetailsData = await sequelize.query(fetchEventDetailsQuery);
    console.log(
      fetchAllTypeOFFacility,
      "fetchalltypeoffacilty",
      fetchEventDetailsData
    );

    let fetchAllAmenities = await sequelize.query(
      `select amenityId, amenityName, statusId from amabhoomi.amenitymasters where statusId = 1`
    );
    let fetchAllServices = await sequelize.query(
      `select serviceId,code,description status from amabhoomi.services where statusId = 1`
    );
    return res.status(statusCode.SUCCESS.code).json({
      message: "All home Page Data",
      facilityTypeDetails: fetchAllTypeOFFacility,
      eventDetailsData: fetchEventDetailsData[0],
      amenityDetails: fetchAllAmenities[0],
      servicesDetails: fetchAllServices[0],
    });
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};
module.exports = {
  updatepublic_user,
  //viewpublic_user,
  viewpublicUser,
  homePage,
};
