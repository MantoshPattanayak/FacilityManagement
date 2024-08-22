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
let file = db.file;
let useractivitypreferencesModels = db.userActivityPreference
let userActivityMaster = db.useractivitymasters
const {Op} = require('sequelize')
let imageUpdate = require('../../../utils/imageUpdate');
let imageUpload = require('../../../utils/imageUpload')

const fileattachmentModels = db.fileattachment;
const updatepublic_user = async (req, res) => {
  let transaction;
  try {
    console.log('232')
    transaction = await sequelize.transaction();
    console.log('req body', req.body, req.user.userId)
    let statusId = 1;
    let inActiveStatus= 2;
    let userId = req.user.userId;
    let updatedDt = new Date();
    let createdDt = new Date();
    console.log(userId,'userId',req.user.userId)
    let {
      encryptFirstName:firstName,
      encryptMiddleName:middleName,
      encryptLastName:lastName,
      //password,
      encryptPhoneNo:phoneNo,
      profilePicture,
      encryptEmailId:emailId,
      encryptActivities:activities,
      encryptLanguagePreference:languagePreference, //need to change 
      encryptPrefredLocation : preferedLocation //need to change
      
    } = req.body;
// console.log("Update Profile", req.body)
    console.log("profile Update", req.body)
    let createActivity;
    let imageUpdateVariable = 0;
    let updateActivities;
    let updatepublicUserCount;
    let params = {};
    let roleId =4;
    
 
    let findPublicuserWithTheGivenId = await user.findOne({
      where: {
        userId: userId,
      },
      transaction
    });
    console.log('2323')
    if (findPublicuserWithTheGivenId.firstName != firstName && firstName) {
      console.log('firstname', firstName, '73')
      params.firstName = firstName;
    } 
     if (findPublicuserWithTheGivenId.middleName != middleName && middleName) {
      params.middleName = middleName;
    } 
     if (findPublicuserWithTheGivenId.lastName != lastName && lastName) {
      params.lastName = lastName;
    } 
    // else if (findPublicuserWithTheGivenId.userName != userName && userName) {
    //     const existuserName = await user.findOne({
    //       where: { userName: userName, statusId:statusId,roleId:roleId},
    //       transaction
    //     });
    //     if (existuserName) {
    //       await transaction.rollback();
    //       return res
    //         .status(statusCode.CONFLICT.code)
    //         .json({ message: "User already exist same userName" });
    //     }
    //     params.userName = userName;
    // }
     
    // if (findPublicuserWithTheGivenId.password != password && password) {
    //   params.password = password;
    // } 
     if (findPublicuserWithTheGivenId.phoneNo != phoneNo && phoneNo) {
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
    } 
 
     if (findPublicuserWithTheGivenId.emailId != emailId && emailId) {
      
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
     if (findPublicuserWithTheGivenId.location != preferedLocation && preferedLocation) {
      
    params.location = preferedLocation;
  }
   if (findPublicuserWithTheGivenId.language != languagePreference && languagePreference) {
      
    params.language = preferedLocation;
  }
  console.log('near 113 line',activities)
        if (activities) {
          let fetchUserActivities = await useractivitypreferencesModels.findAll({
            where: {
              userId: userId,
              statusId:statusId
            },
            transaction
          });
          let fetchActivities = fetchUserActivities.map((data) => {
            return data.userActivityId;
          });
          for (let activity of activities) {
            console.log('activity',activity)
            if (!fetchActivities.includes(activity)) {
              console.log(activity,'activity')
             createActivity = await useractivitypreferencesModels.create(
                {
                  userActivityId: activity,
                  userId:userId,
                  statusId:statusId,
                  createdBy:userId,
                  updatedBy:userId,
                  updatedDt:updatedDt,
                  createdDt:createdDt
                },
                {
                  
                  transaction
                }
            
              );
              if(!createActivity){
                await transaction.rollback();
                return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                  message: "Something went wrong",
                });
              }
            }
          }
      
          // Update status to 2 for removed activities
          for (let fetchActivity of fetchActivities) {
            if (!activities.includes(fetchActivity)) {
              console.log(!activities.includes(fetchActivity),'fetchactivities',fetchActivity)
              updateActivities = await useractivitypreferencesModels.update(
                { statusId: 2 },
                { 
                  where: {
                    [Op.and]: [{userId: userId}, 
                    {userActivityId: fetchActivity}]
                  }, 
                  transaction 
                }
              );
              console.log('update activities', updateActivities)
              if(updateActivities.length==0){
                await transaction.rollback();
                return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                  message: "Something went wrong",
                });
              }
            }
            
          }
        }
        // console.log('near 176 line','data',profilePicture,'profile data')

      if(Object.keys(profilePicture).length>0){
        // console.log('profilePicture?.data',profilePicture?.data)
        if(profilePicture.fileId!=0 && profilePicture?.data){
          console.log('inside image part')
          let findThePreviousFilePath = await file.findOne({
            where:{[Op.and]:[{statusId:statusId},{fileId:profilePicture.fileId}]},
            transaction
          })
          let oldFilePath = findThePreviousFilePath?.url
          let errors=[];
          let insertionData = {
           id:userId,
           name:decrypt(firstName),
           fileId:profilePicture.fileId
          }
             let subDir = "userDir"
          //update the data
          let updateSingleImage = await imageUpdate(profilePicture.data,subDir,insertionData,userId,errors,1,transaction,oldFilePath)
          if(errors.length>0){

            await transaction.rollback();

            if(errors.some(error => error.includes("something went wrong"))){
              return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
            }
            return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
          }
          imageUpdateVariable = 1;
      }
      else if(!profilePicture.fileId && profilePicture?.data){
        console.log('inside new image part')
        let insertionData = {
          id:userId,
          name:decrypt(firstName)
         }
        // create the data
        let entityType = 'usermaster'
        let errors = [];
        let subDir = "userDir"
        let filePurpose = "User Image"
        let uploadSingleImage = await imageUpload(profilePicture.data,entityType,subDir,filePurpose,insertionData,userId,errors,1,transaction)
        console.log( uploadSingleImage,'165 line facility image')
        if(errors.length>0){
          await transaction.rollback();
          if(errors.some(error => error.includes("something went wrong"))){
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
          }
          return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
        }
        imageUpdateVariable = 1;

    }
      else if(profilePicture.fileId!=0){
        console.log('inside file')
        let inactiveTheFileId = await file.update({statusId:inActiveStatus},
         { where:{
            fileId:profilePicture.fileId
          },
        transaction}
        )

        console.log('fileid', inactiveTheFileId)
        let inActiveTheFileInFileAttachmentTable = await fileattachmentModels.update({
          statusId:inActiveStatus
        },
      {where:{
        fileId:profilePicture.fileId
      },
      transaction
    }
    )
    console.log('file update check',  inactiveTheFileId,'file attachemnt ' ,inActiveTheFileInFileAttachmentTable )
    if(inactiveTheFileId.length == 0 || inActiveTheFileInFileAttachmentTable == 0){
      await transaction.rollback();
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message:`Something went wrong`
      })
    }
    else{
      imageUpdateVariable = 1;
    }

      }
      else{
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:`Something went wrong`
        })
      }
     
    }
    console.log('outside profile update part',params)

    if(Object.keys(params).length>0){
      console.log('inside update part')

      params.updatedBy = userId;
      params.updatedDt = updatedDt;
      console.log('near 225 line')

      updatepublicUserCount=
        await user.update(params, {
        where: {
          [Op.and]: [{userId: userId},{statusId:statusId},]
        },
        transaction
      });

    }
      console.log('near 233 line', createActivity)
    if (updatepublicUserCount >= 1 || imageUpdateVariable==1 || createActivity || updateActivities.length>=1) {
     
      await transaction.commit();
      console.log('data updated')
      return res.status(statusCode.SUCCESS.code).json({
        message: "Updated Successfully",
      });
    } else {
      await transaction.rollback();
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: "Data not Updated ",
      });
    }
    
    
    
  } catch (error) {
    if(transaction) await transaction.rollback();
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
 
    let publicRole = 4 //role id for user
    let statusId = 1;
    let entityType = 'usermaster'
    let filePurpose = 'User Image'
    // let showpublic_user = await user.findOne({
    //   where: {
    //    [Op.and]: [{ userId: userId},{statusId:statusId},{roleId:publicRole}]
    //   },
    // });
    
    
    let showpublic_user = await sequelize.query(`select u.* from amabhoomi.usermasters u where u.statusId = ? and u.roleId =? and u.userId = ?
   `,{type:QueryTypes.SELECT,
    replacements:[statusId,publicRole,userId]
   })
  //  console.log('show public user', showpublic_user)
   let findTheImageUrl = await sequelize.query(`select fl.url,fl.fileId from amabhoomi.usermasters u inner join fileattachments f on u.userId = f.entityId  
   inner join files fl on fl.fileId = f.fileId where f.entityType = ? and f.filePurpose =? and u.statusId = ? and u.roleId =? and u.userId = ? and fl.statusId = ? and f.statusId = ?`,
   {type:QueryTypes.SELECT,
    replacements:[entityType,filePurpose,statusId,publicRole,userId,statusId,statusId]})
    
    if(findTheImageUrl.length>0){
      showpublic_user[0].url = findTheImageUrl[0].url;
      showpublic_user[0].fileId = findTheImageUrl[0].fileId;
    }

   let showActivities = await sequelize.query(`select um.userActivityId, um.userActivityName from amabhoomi.useractivitymasters um
    inner join amabhoomi.useractivitypreferences up on um.userActivityId = up.userActivityId where up.statusId=? and up.userId=? `,
  {
    replacements:[statusId,userId],
    type:QueryTypes.SELECT
  })
    

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
      activityDetails:showActivities
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
    let facilityTypeIdForActivities = 2;
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

    let fetchEventDetailsData = await sequelize.query(fetchEventDetailsQuery,{
      type:QueryTypes.SELECT
    });
    console.log(
      fetchAllTypeOFFacility,
      "fetchalltypeoffacilty",
      fetchEventDetailsData
    );

    let fetchAllAmenities = await sequelize.query(
      `select amenityId, amenityName, statusId from amabhoomi.amenitymasters where statusId = 1`,{
        type:QueryTypes.SELECT
      }
    );
    let fetchAllServices = await sequelize.query(
      `select serviceId,code,description status from amabhoomi.services where statusId = 1`,{
        type:QueryTypes.SELECT
      }
    );

    let viewNotificationsListQuery = `
        select p.publicNotificationsId, p.publicNotificationsTitle, p.publicNotificationsContent, f.fileId, f.fileName, f.url,p.createdOn as createdAt
        from amabhoomi.publicnotifications p
        left join fileattachments fa on p.publicNotificationsId = fa.entityId and fa.entityType = 'publicNotification'
        left join files f on f.fileId = fa.fileId and f.statusId = 1
        where p.validToDate >= ?
        `;

    let viewNotificationsListQueryData = await sequelize.query(viewNotificationsListQuery, {
      type: QueryTypes.SELECT,
      replacements: [new Date()]
    })

    let facilityActivitiesFetchQuery = `
      select fa.id, f.facilityId, f.facilityTypeId, f.facilityname, u.userActivityId, u.userActivityName
      from amabhoomi.facilityactivities fa
      inner join amabhoomi.facilities f on f.facilityId = fa.facilityId and fa.statusId = 1
      inner join amabhoomi.useractivitymasters u on fa.activityId = u.userActivityId where f.facilityTypeId = ?
    `;

    let facilityActivitiesData = await sequelize.query(facilityActivitiesFetchQuery,{
      type:QueryTypes.SELECT,
      replacements:[facilityTypeIdForActivities]
    });

    let fetchGalleryListQuery = `
      select g.galleryId, g.description, g.startDate, g.endDate, s.statusCode, f2.fileName, f2.url
      from gallerydetails g
      inner join fileattachments f on g.galleryId = f.entityId and f.entityType = 'galleryImage' and f.filePurpose = 'galleryImage'
      inner join files f2 on f.fileId = f2.fileId
      inner join statusmasters s on s.statusId = g.statusId and s.parentStatusCode = 'RECORD_STATUS'
      where s.statusCode = 'ACTIVE'
      limit 10;
    `;

    let fetchGalleryListData = await sequelize.query(fetchGalleryListQuery,{
      type:QueryTypes.SELECT
    });

    let fetchActivityMaster = await userActivityMaster.findAll({
      order:['userActivityName']
    });

    return res.status(statusCode.SUCCESS.code).json({
      message: "All home Page Data",
      facilityTypeDetails: fetchAllTypeOFFacility,
      eventDetailsData: fetchEventDetailsData.map((event) => {return { ...event, ['eventMainImage']: encodeURI(event.eventMainImage)}}),
      amenityDetails: fetchAllAmenities,
      servicesDetails: fetchAllServices,
      notificationsList:viewNotificationsListQueryData,
      exploreActivities: facilityActivitiesData,
      galleryData: fetchGalleryListData.map((gallery) => {return {...gallery, ['url']: encodeURI(gallery.url)}}),
      fetchActivityMaster
    });
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};

let fetchGoogleMap = async (req, res) => {
  try {
    let { apiKey, callbackName } = req.body;
    apiKey = decrypt(apiKey);
    callbackName = decrypt(callbackName);
    const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`; // Add other libraries if needed
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch Google Maps script: ${response.statusText}`);
    }

    const scriptContent = await response.text();
    res.set('Content-Type', 'application/javascript');
    res.status(statusCode.SUCCESS.code).json(scriptContent);
  }
  catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message
    })
  }
}
module.exports = {
  updatepublic_user,
  //viewpublic_user,
  viewpublicUser,
  homePage,
  fetchGoogleMap
};
