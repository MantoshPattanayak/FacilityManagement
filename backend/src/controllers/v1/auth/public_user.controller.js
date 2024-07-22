const db = require("../../../models/index");
let statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const Sequelize = db.Sequelize;
const bcrypt = require("bcrypt");
const { decrypt } = require("../../../middlewares/decryption.middlewares");
const { encrypt } = require("../../../middlewares/encryption.middlewares");
const facilityType = db.facilitytype;
let user = db.usermaster
let useractivitypreferencesModels = db.userActivityPreference
const {Op} = require('sequelize')
const updatepublic_user = async (req, res) => {
  try {
    console.log('req body', req.body, req.user.userId)
    let statusId = 1;
    let userId = req.user.userId;
    console.log(userId,'userId',req.user.userId)
    let {
      encryptTitle:title,
      encryptFirstName:firstName,
      encryptMiddleName:middleName,
      encryptLastName:lastName,
      encryptUserName: userName,
      //password,
      encryptPhoneNo:phoneNo,
      encryptAltPhoneNo:altPhoneNo,
      profilePicture,
      encryptEmailId:emailId,
      encryptActivities:activities,
      encryptLanguagePreference:languagePreference, //need to change 
      encryptPrefredLocation : preferedLocation //need to change
      
    } = req.body;
// console.log("Update Profile", req.body)
    console.log("profile Update", req.body)

    let params = {};
    let roleId =4;
    
 
    let findPublicuserWithTheGivenId = await user.findOne({
      where: {
        userId: userId,
      },
      transaction
    });
    console.log('2323')
    if (findPublicuserWithTheGivenId.title != title && title) {
      console.log('70')
      params.title = title;
    } else if (findPublicuserWithTheGivenId.firstName != firstName && firstName) {
      console.log('firstname', firstName, '73')
      params.firstName = firstName;
    } else if (findPublicuserWithTheGivenId.middleName != middleName && middleName) {
      params.middleName = middleName;
    } else if (findPublicuserWithTheGivenId.lastName != lastName && lastName) {
      params.lastName = lastName;
    } else if (findPublicuserWithTheGivenId.userName != userName && userName) {
        const existuserName = await user.findOne({
          where: { userName: userName, statusId:statusId,roleId:roleId},
          transaction
        });
        if (existuserName) {
          return res
            .status(statusCode.CONFLICT.code)
            .json({ message: "User already exist same userName" });
        }
        params.userName = userName;
    } else if (findPublicuserWithTheGivenId.password != password && password) {
      params.password = password;
    } else if (findPublicuserWithTheGivenId.phoneNo != phoneNo && phoneNo) {
      const existingphoneNo = await user.findOne({
        where: { phoneNo: phoneNo,statusId:statusId, roleId:roleId },
      });
      if (existingphoneNo) {
        await transaction.rollback();
        return res
          .status(statusCode.CONFLICT.code)
          .json({ message: "User already exist same phoneNo" });
      } 
      params.phoneNo = phoneNo;
    } else if (findPublicuserWithTheGivenId.altPhoneNo != altPhoneNo && altPhoneNo) {
        const existingaltPhoneNo = await user.findOne({
          where: { altPhoneNo: altPhoneNo, statusId:statusId, roleId:roleId },
          transaction
        });
        if (existingaltPhoneNo) {
          await transaction.rollback();
          return res
            .status(statusCode.CONFLICT.code)
            .json({ message: "User already exist same altPhoneNo" });
        }
      params.altPhoneNo = altPhoneNo;
    } else if (findPublicuserWithTheGivenId.emailId != emailId && emailId) {
      
        const existingemailId = await user.findOne({
          where: { emailId: emailId ,statusId:statusId, roleId:roleId },
          transaction
        });
        if (existingemailId) {
          await transaction.rollback();
          return res.status(statusCode.CONFLICT.code).json({
            message: "User already exist with given emailId",
          });
        }
      params.emailId = emailId;
    }
    let [updatepublicUserCount, updatepublicUserData] =
      await user.update(params, {
        where: {
          [Op.and]: [{userId: userId},{statusId:statusId},]
         },
         transaction
      });

      console.log('update public user count', updatepublicUserCount)

        if (activities) {
          let fetchUserActivities = await useractivitypreferencesModels.findAll({
            where: {
              userId: userId,
            },
            transaction
          });
      
          let fetchActivities = fetchUserActivities.map((data) => {
            return data.userActivityId;
          });
      
          for (let activity of activities) {
            if (!fetchActivities.includes(activity)) {
              await useractivitypreferencesModels.update(
                {
                  userId: userId,
                  userActivityId: activity,
                },
                { transaction }
              );
            }
          }
      
          // Update status to 2 for removed activities
          for (let fetchActivity of fetchActivities) {
            if (!activities.includes(fetchActivity)) {
              await useractivitypreferencesModels.update(
                { status: 2 },
                { where: { userId: userId, userActivityId: fetchActivity }, transaction }
              );
            }
            
            await transaction.commit();
  
            res.status(statusCode.SUCCESS.code).json({
                message: 'User profile updated',
            })
          }
        }
      
      if(profilePicture){
      
      }
    if (updatepublicUserCount >= 1) {
      return res.status(statusCode.SUCCESS.code).json({
        message: "Updated Successfully",
      });
    } else {
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: "Not Updated ",
      });
    }
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
    console.log(21, req.user.userId)
    let userId = req.user?.userId || 1;
    let publicRole = 4
    let statusId = 1;
    let showpublic_user = await user.findOne({
      where: {
       [Op.and]: [{ userId: userId},{statusId:statusId},{roleId:publicRole}]
      },
    });

    console.log('show public user', showpublic_user)
    // let decryptUser = showpublic_user.map((encryptData)=>({
    //   encryptData. && encryptdData
    // }))

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

    // let fetchEventDetailsQuery = `select eventId, eventName, eventCategory,locationName,eventDate,eventStartTime,
    // eventEndTime, descriptionOfEvent from amabhoomi.eventactivities where ticketSalesEnabled =1 `;

    let fetchEventDetailsQuery = `
      SELECT 
      ea.eventId,
      ea.facilityId,
      f.facilityname,
      f.latitude, 
      f.longitude,
      ea.eventName, 
      ea.eventCategoryId,
      ecm.eventCategoryName as eventCategory,
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
        WHEN ea.eventStartTime >= CONVERT_TZ(NOW(), @@session.time_zone, 'SYSTEM') 
        THEN 'ACTIVE'
        ELSE 'CLOSED'
      END AS status,
      ea.additionalDetails,
      f3.url as eventMainImage
      , h.hostBookingId
      FROM amabhoomi.eventactivities ea 
      inner join amabhoomi.statusmasters sm ON sm.statusId = ea.statusId
      inner JOIN amabhoomi.facilities f on ea.facilityId = f.facilityId
      inner join amabhoomi.eventcategorymasters ecm on ea.eventCategoryId = ecm.eventCategoryId
      inner join amabhoomi.fileattachments f2 on f2.entityId = ea.eventId and f2.entityType = 'events' and f2.filePurpose = 'Event Image'
      inner join amabhoomi.files f3 on f3.fileId = f2.fileId
      inner join amabhoomi.hosteventdetails hed on hed.eventId = ea.eventId
      inner join amabhoomi.hostbookings h on hed.hostId = h.hostId
      inner join amabhoomi.statusmasters s on s.statusId = h.statusId and s.parentStatusCode = "HOSTING_STATUS"
      where s.statusCode = 'APPROVED'
      ORDER BY ea.eventDate DESC`;

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

    let viewNotificationsListQuery = `
        select p.publicNotificationsId, p.publicNotificationsTitle, p.publicNotificationsContent, f.fileId, f.fileName, f.url,p.createdOn as createdAt
        from amabhoomi.publicnotifications p
        left join fileattachments fa on p.publicNotificationsId = fa.entityId and fa.entityType = 'publicNotification'
        left join files f on f.fileId = fa.fileId and f.statusId = 1
        where p.validToDate >= ?
        `;

    let viewNotificationsListQueryData = await sequelize.query(viewNotificationsListQuery, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: [new Date()]
    })

    let facilityActivitiesFetchQuery = `
      select fa.id, f.facilityId, f.facilityTypeId, f.facilityname, u.userActivityId, u.userActivityName
      from amabhoomi.facilityactivities fa
      inner join amabhoomi.facilities f on f.facilityId = fa.facilityId
      inner join amabhoomi.useractivitymasters u on fa.activityId = u.userActivityId
    `;

    let facilityActivitiesData = await sequelize.query(facilityActivitiesFetchQuery);

    let fetchGalleryListQuery = `
      select g.galleryId, g.description, g.startDate, g.endDate, s.statusCode, f2.fileName, f2.url
      from gallerydetails g
      inner join fileattachments f on g.galleryId = f.entityId and f.entityType = 'galleryImage' and f.filePurpose = 'galleryImage'
      inner join files f2 on f.fileId = f2.fileId
      inner join statusmasters s on s.statusId = g.statusId and s.parentStatusCode = 'RECORD_STATUS'
      where s.statusCode = 'ACTIVE'
      limit 10;
    `;

    let fetchGalleryListData = await sequelize.query(fetchGalleryListQuery);

    return res.status(statusCode.SUCCESS.code).json({
      message: "All home Page Data",
      facilityTypeDetails: fetchAllTypeOFFacility,
      eventDetailsData: fetchEventDetailsData[0].map((event) => {return { ...event, ['eventMainImage']: encodeURI(event.eventMainImage)}}),
      amenityDetails: fetchAllAmenities[0],
      servicesDetails: fetchAllServices[0],
      notificationsList:viewNotificationsListQueryData,
      exploreActivities: facilityActivitiesData[0],
      galleryData: fetchGalleryListData[0].map((gallery) => {return {...gallery, ['url']: encodeURI(gallery.url)}})
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
