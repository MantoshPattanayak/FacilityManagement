const db = require("../../../models/index");
let statusCode = require("../../../utils/statusCode");
const public_user = db.publicuser;
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const Sequelize = db.Sequelize;
const bcrypt = require("bcrypt");
const { decrypt } = require("../../../middlewares/decryption.middlewares");
const { encrypt } = require("../../../middlewares/encryption.middlewares");
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
      lastLogin,
    } = req.body;

    let params = {};
    if (existingUserName) {
      return res
        .status(statusCode.CONFLICT.code)
        .json({ message: "User already exist same user_name" });
    } else if (existingPhoneNo) {
      return res
        .status(statusCode.CONFLICT.code)
        .json({ message: "User already exist same phone_no" });
    } else if (existingAlternatePhoneNo) {
      return res
        .status(statusCode.CONFLICT.code)
        .json({ message: "User already exist same alt_phone_no" });
    } else if (existingUserEmail) {
      return res
        .status(statusCode.CONFLICT.code)
        .json({ message: "User already exist with given email_id " });
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
    } else if (findPublicuserWithTheGivenId.profilePicture != profilePicture) {
      params.profilePicture = profilePicture;
    } else if (findPublicuserWithTheGivenId.lastLogin != lastLogin) {
      params.lastLogin = lastLogin;
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

const viewpublic_user = async (req, res) => {
  try {
    let limit = req.body.page_size ? req.body.page_size : 50;
    let page = req.body.page_number ? req.body.page_number : 1;
    let offset = (page - 1) * limit;
    let showAllpublic_user = await public_user.findAll({});

    let givenReq = req.body.givenReq ? req.body.givenReq : null;
    if (givenReq) {
      showAllpublic_user = showAllpublic_user.filter(
        (public_userData) =>
          public_userData.publicUserId.includes(givenReq) ||
          public_userData.title.includes(givenReq) ||
          public_userData.firstName.includes(givenReq) ||
          public_userData.middleName.includes(givenReq) ||
          public_userData.lastName.includes(givenReq) ||
          public_userData.updatepublic_user.includes(givenReq) ||
          public_userData.password.includes(givenReq) ||
          public_userData.phoneNo.includes(givenReq) ||
          public_userData.altPhoneNo.includes(givenReq) ||
          public_userData.emailId.includes(givenReq) ||
          public_userData.profilePicture.includes(givenReq) ||
          public_userData.lastLogin.includes(givenReq) ||
          public_userData.googleId.includes(givenReq) ||
          public_userData.facebookId.includes(givenReq)
      );
    }
    let paginatedShowAllspublic_user = showAllpublic_user.slice(
      offset,
      limit + offset
    );
    return res.status(statusCode.SUCCESS.code).json({
      message: "Show All public_user",
      public_user: paginatedShowAllspublic_user,
    });
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: err.message,
    });
  }
};
module.exports = {
  updatepublic_user,
  viewpublic_user,
};
