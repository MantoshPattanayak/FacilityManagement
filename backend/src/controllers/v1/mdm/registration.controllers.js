

const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const facilities = db.facilities;
const facilityType = db.facilitytype
const Sequelize = db.Sequelize;
let serviceFacility = db.servicefacilities
let serviceMaster = db.services
let amenityFacility = db.amenityfacilities
let amenityMaster = db.amenitiesmaster
const file = db.file;
let activityMaster = db.useractivitymasters
let amenities = db.amenitiesmaster
// let eventCategory = db.eventCategory
const fileAttachment = db.fileattachment;
const sendEmail = require('../../../utils/generateEmail')
const mailToken= require('../../../middlewares/mailToken.middlewares');
let inventoryMaster = db.inventorymaster
let inventoryFacilities = db.inventoryfacilities
let eventCategoryMaster = db.eventCategoryMaster
let facilityAcitivities = db.facilityactivities
let ownershipDetails = db.ownershipDetails
let fileattachment = db.fileattachment;
const { Op } = require('sequelize');
let user = db.usermaster
let imageUpload = require('../../../utils/imageUpload')
let imageUpdate= require('../../../utils/imageUpdate');

let facilityEvent = db.facilityEvents
// Admin facility registration

const registerFacility = async (req, res) => {
  let transaction
  try {
    transaction = await sequelize.transaction();
     console.log("check Api", "1")
    let userId = req.user?.userId || 1;
    let statusId = 1;
    let createdDt = new Date();
    let updatedDt = new Date();
    findTheRoleFromTheUserId = await user.findOne({
      where:{
        [Op.and]:[{userId:userId},{statusId:statusId}]
      },
      transaction
    })

    let {
      
      facilityType,
      facilityName,
      longitude,
      latitude,
      address,
      pin,
      ownership,
      area,
      operatingHoursFrom,
      operatingHoursTo,
      operatingDays,  //here operating days will come in the form of array of data i.e. array of  days
      service,  //here services will be given in the form of object 
      otherServices, //here others will be given in the form of string 
      amenity, // here amenities will be given in the form of form of object 
      otherAmenities, // here other amenities will be given in the form of string
      additionalDetails,
      facilityImage,
      eventCategory,
      othereventCategory,
      game,
      othergame,
      parkInventory,
      // owner details 
      firstName,
      lastName,
   facilityisownedbBDA,
      phoneNumber,
      emailAdress,
      ownerPanCard,
      ownersAddress,
      helpNumber,
      capacity
    } = req.body;
    console.log("here facility Req ", req.body)


    helpNumber = helpNumber ? helpNumber : null
    capacity = capacity ? capacity : 100;

    let createFacilities;
    let findOwnerId;
     console.log("here Req", 
      facilityType,
      facilityName,
      longitude,
      latitude,
      address,
      pin,
      ownership,
      area,  //allow area value to be in decimal
      operatingHoursFrom,
      operatingHoursTo,
      operatingDays,  //here operating days will come in the form of array of data i.e. array of  days
      service,  //here services will be given in the form of object 
      otherServices, //here others will be given in the form of string 
      amenity, // here amenities will be given in the form of form of object 
      otherAmenities, // here other amenities will be given in the form of string
      additionalDetails,
      eventCategory,
      othereventCategory,
      game,
      othergame,
      parkInventory,
      // owner details 
      firstName,
      lastName,
      ownerPanCard,
      ownersAddress,
      lastName,
      facilityisownedbBDA)
      if(facilityisownedbBDA==1){
        ownership = "BDA"
      }
      console.log('check if the data is exist or not')
     let checkIfTheFacilityAlreadyExist = await facilities.findOne({
      where:{
        [Op.and]:[{statusId:statusId},                    
          sequelize.where(sequelize.fn('LOWER', sequelize.col('facilityname')), 'LIKE', facilityName.toLowerCase()),
          ,{facilityTypeId:facilityType}]
      },
      transaction
     })
     console.log('check if the facility data is present or not', checkIfTheFacilityAlreadyExist)
     if(checkIfTheFacilityAlreadyExist){
      console.log('This data already exist')
      return res.status(statusCode.BAD_REQUEST.code).json({
        message:`This facility is already exist`
      })
     }
     let findIfTheOwnershipDetailsExist = await ownershipDetails.findOne({
      where:{
        [Op.and]:[{[Op.or]:[{phoneNo:phoneNumber},{emailId:emailAdress}]},{statusId:statusId}]},
        transaction
     })
     if(findIfTheOwnershipDetailsExist){
      console.log('if owners detail exist', 89)
      findOwnerId = findIfTheOwnershipDetailsExist.ownershipDetailId
     }
     if(!findIfTheOwnershipDetailsExist){
      console.log('if owners detail doesnot exist', 93)
      let createOwnershipDetails = await ownershipDetails.create({
        firstName:firstName,
        lastName:lastName,
        phoneNo:phoneNumber,
        emailId:emailAdress,
        statusId:statusId,
        ownerPanCardNumber:ownerPanCard,
        ownerAddress:ownersAddress,
        isFacilityByBda:facilityisownedbBDA, 
        createdDt:createdDt,
        updatedDt:updatedDt,
        createdBy:userId,
        updatedBy:userId
      },
    {transaction})

      if(createOwnershipDetails){
        findOwnerId = createOwnershipDetails.ownershipDetailId
      }
      else{
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:"Something went wrong"
        })
      }
     }
     console.log('create facility 104')
     createFacilities = await facilities.create({
      facilityname:facilityName,
      ownership:ownership,
      facilityTypeId:facilityType,
      longitude:longitude,
      latitude:latitude,
      address:address,
      pin:pin,
      statusId:statusId,
      operatingHoursFrom:operatingHoursFrom,
      operatingHoursTo:operatingHoursTo,
      areaAcres:area,
      capacity:capacity,
      sun:operatingDays?.sun || 0,
      mon:operatingDays?.mon || 0,
      tue:operatingDays?.tue || 0,
      wed:operatingDays?.wed || 0,
      thu:operatingDays?.thu || 0,
      fri:operatingDays?.fri || 0,
      sat:operatingDays?.sat || 0,
      additionalDetails:additionalDetails,
      otherAmenities:otherAmenities,
      otherEventCategory:othereventCategory,
      otherGames:othergame,
      helpNumber:helpNumber,
      otherServices:otherServices,
      ownershipDetailId:findOwnerId,
      createdDt:createdDt,
      updatedDt:updatedDt,
      createdBy:userId,
      updatedBy:userId
    },
  {transaction})

    if(createFacilities) {

      
      if (facilityImage) {
        // facility image format should be facilityImage ={facilityImageOne:"hkjhfkdfk", facilityArrayOfImages:[fjdjfljlkfdj,jldjlkfjdlj]}
          let entityType = 'facilities'
          let serverError = 'something went wrong'
          let cardFacilityImage = facilityImage.facilityImageOne
          let arrayFacilityImage = facilityImage.facilityArrayOfImages
          let insertionData = {
           id:createFacilities.facilityId,
           name:createFacilities.facilityname
          }
        if(cardFacilityImage){
          let errors = [];
          let subDir = "facilityImages"
          let filePurpose = "singleFacilityImage"
          console.log(entityType,subDir,filePurpose,insertionData,userId,errors, '163 line facility image')
          
          let uploadSingleFacilityImage = await imageUpload(cardFacilityImage,entityType,subDir,filePurpose,insertionData,userId,errors, 1, transaction)
          console.log( uploadSingleFacilityImage,'165 line facility image')
          if(errors.length>0){
            await transaction.rollback();
            if(errors.some(error => error.includes("something went wrong"))){
              return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
            }
            return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
          }
        }
        if(arrayFacilityImage.length>0){
          let errors = [];
          let subDir = "facilityImageList"
          let filePurpose = "multipleFacilityImage"
          
          for (let i = 0; i < arrayFacilityImage.length; i++) {
            let eachFacilityImage = arrayFacilityImage[i]
            let uploadSingleFacilityImage = await imageUpload(eachFacilityImage,entityType,subDir,filePurpose,insertionData,userId,errors, i+1, transaction)
          }

          if(errors.length>0){
            await transaction.rollback();
            
            if(errors.some(error => error.includes("something went wrong"))){
              return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
            }
            return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
          }

        }
      }
          

      if(amenity) {
         console.log('amenity', amenity)
        for(let amenityData of amenity){
          console.log(createFacilities.facilityId, 'create facilityid view', amenity)
            let createAmenities = await amenityFacility.create( { 
              facilityId:createFacilities.facilityId,
              amenityId:amenityData,
              statusId:statusId,
              createdBy:userId,
              createdDt:new Date(),
              updatedBy:userId,
              updatedDt:new Date()

            },
            {transaction}
            )
            console.log('amenity insert result',createAmenities)
            if(!createAmenities){
              await transaction.rollback();
              return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:"Something went wrong"
              })
            }

          }
          
      
      }
  
  if(service) { 
   for(let serviceData of service){
      let createServices = await serviceFacility.create( { 
        facilityId:createFacilities.facilityId,
        serviceId:serviceData,
        statusId:statusId,
        createdBy:userId,
        createdDt:new Date(),
        updatedBy:userId,
        updatedDt:new Date()

        
      },
      {transaction
}
      )
      if(!createServices){
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:"Something went wrong"
        })
      }
     

  
    }
    
  }
    // // Here add event categories
    if(eventCategory){
      console.log(eventCategory, 'eventData')
      for(let eventData of eventCategory){
          let createEventCategoryDetails = await facilityEvent.create({
          eventCategoryId:eventData,
          createdBy:userId,
          updatedBy:userId,
          createdDt:createdDt,
          updatedDt:updatedDt,
          facilityId:createFacilities.facilityId,
          statusId:statusId
        },{transaction}
      )
        if(!createEventCategoryDetails){
          await transaction.rollback();
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:"Something went wrong"
          })
        }
      }
    }
    // add games 
    if(game){
      for (let eachGame of game){
          let createGameDetails = await facilityAcitivities.create({
          facilityId:createFacilities.facilityId,
          activityId:eachGame,
          facilityTypeId:createFacilities.facilityTypeId,
          statusId:statusId,
          createdBy:userId,
          updatedBy:userId,
          createdDt:createdDt,
          updatedDt:updatedDt
        },{transaction}
      )
        if(!createGameDetails){
          await transaction.rollback();
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:"Something went wrong"
          })
        }
      }
    }

    // after all of these let add the park inventory details
    // here the park inventory data should look like this : {inventory:{}, inventory:{}}
    if(parkInventory){
      for(let inventory of parkInventory){
        let createInventory = await inventoryFacilities.create({
          facilityId:createFacilities.facilityId,
          equipmentId:inventory.equipmentId,
          count:inventory.count,
          statusId:statusId,
          createdBy:userId,
          createdDt:new Date(),
          updatedBy:userId,
          updatedDt:new Date()
        }, {transaction})
        if(!createInventory){
          await transaction.rollback();
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:"Something went wrong"
          })
        }
      }
    
    
    }

    console.log('upto transaction it is coming')
    // if everything is successfull, then do commit the transaction here
    await transaction.commit()
 
    return res.status(statusCode.SUCCESS.code).json({
      message:"Facility successfully registered"
    })
  
  }

  else{
    await transaction.rollback()
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:"Something went wrong"
    })
  }

  
 } catch (error) {
  if(transaction) await transaction.rollback();
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message,
    });
  }
};


// initial Data fetch 
const initialDataFetch = async (req,res)=>{
    try {
      console.log('initial data fetch')
      let statusId = 1
      let facilityEventType = 6;
      let facilityEventHostType = 7
        let fetchFacilityTypes = await facilityType.findAll({
          where: {
            statusId:statusId,
            facilityTypeId:{
              [Op.notIn]:[facilityEventType,facilityEventHostType]
            }
          }
        })
        console.log('fetchfacilitytypes',fetchFacilityTypes)
        console.log(fetchFacilityTypes,'fetchFacilitytypes')
        let fetchServices = await serviceMaster.findAll(
          {
            where: {
              statusId:statusId
            }
          }
        )
        let fetchAmenities = await amenities.findAll(
          {
            where: {
              statusId:statusId
            }
          }
        )
        let fetchInventory = await inventoryMaster.findAll(
          {
            where:{
              statusId:statusId
            }
          }
        )
        let fetchActivityMaster = await activityMaster.findAll({
          where:{
            statusId:statusId
          }
        })
        let fetchEventCategories = await sequelize.query(`select * from amabhoomi.eventcategorymasters`,{
          where:{
            statusId:statusId
          },
          type:Sequelize.QueryTypes.SELECT,
          
        })
      
        return res.status(statusCode.SUCCESS.code).json(
        {  message:`These are all initial dropdown data for facility Types, services, amenities`,
        facilityType:fetchFacilityTypes,
        fetchServices:fetchServices,
        fetchAmenities:fetchAmenities,
        fetchInventory:fetchInventory,
        fetchActivity:fetchActivityMaster,
        fetchEventCategory:fetchEventCategories
        }
        )
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}


const getFacilityWrtId = async(req,res)=>{
  try {
    console.log('232',req.body)
    let{facilityId,facilityTypeId} = req.body
    let statusId = 1
    let findTheFacilityDetils = await facilities.findOne({
      where:{[Op.and]:[{statusId:statusId},{facilityId:facilityId}]},
      attributes:[['facilityname','facilityName'], 'facilityId',
      'ownership',['facilityTypeId','facilityType'],'scheme',['areaAcres','area'],
      'operatingHoursFrom','operatingHoursTo','sun','mon','tue',
      'wed','thu',
      'fri','sat',['otherGames','othergame'],'otherServices','otherAmenities',['otherEventCategories','othereventCategory'],'additionalDetails','pin','helpNumber','longitude','latitude','address' ]
    })
    let findAmenityDetails = await sequelize.query(`select am.amenityName, am.amenityId, fa.amenityFacilityId from amabhoomi.amenitymasters am inner join facilityamenities fa on fa.amenityId = am.amenityId where fa.facilityId = ? and fa.statusId=?`,
      
     { replacements:[facilityId,statusId],
      type:QueryTypes.SELECT}
    )

    let findServiceDetails = await sequelize.query(` select s.code, sf.serviceId from services s  inner join amabhoomi.servicefacilities sf on sf.serviceId = s.serviceId where sf.facilityId = ? and sf.statusId=?`,
      
      { replacements:[facilityId,statusId],
       type:QueryTypes.SELECT}
     )
   
     let findActivityDetails = await sequelize.query(`select fa.activityId as userActivityId , um.userActivityName as userActivityName  from amabhoomi.facilityactivities fa inner join useractivitymasters um on fa.activityId = um.userActivityId where fa.facilityId = ? and fa.statusId= ? and fa.facilityTypeId = ?`,
      
      { replacements:[facilityId,statusId,facilityTypeId],
       type:QueryTypes.SELECT}
     )

     let findEventDetails = await sequelize.query(`select em.eventCategoryName, fe.eventCategoryId as eventCategoryId  from amabhoomi.facilityevents fe inner join eventcategorymasters em on em.eventCategoryId = fe.eventCategoryId where  fe.facilityId = ? and fe.statusId = ? `,
      
      { replacements:[facilityId,statusId],
       type:QueryTypes.SELECT}
     )
     
     let findMultipleImages = await sequelize.query(`select f.fileId, f.fileName as code, f.fileType, f.url, fa.attachmentId from amabhoomi.files f  inner join fileattachments fa on f.fileId = fa.fileId where fa.entityId = ? and fa.filePurpose = 'multipleFacilityImage' and fa.entityType = 'facilities'  and fa.statusId= ?`,
      
      { replacements:[facilityId,statusId],
       type:QueryTypes.SELECT}
     )

     let findSingleImage = await sequelize.query(`select f.fileId, f.fileName as code, f.fileType, f.url, fa.attachmentId from amabhoomi.files f  inner join fileattachments fa on f.fileId = fa.fileId where fa.entityId = ? and fa.filePurpose = 'singleFacilityImage'and fa.entityType = 'facilities'  and fa.statusId= ?`,
      { replacements:[facilityId,statusId],
       type:QueryTypes.SELECT}
     )
     findSingleImage.map(eachData=>{
      eachData.url = encodeURI(eachData.url)
      return eachData
     })

     findMultipleImages.map(eachData=>{
      eachData.url = encodeURI(eachData.url)
      return eachData
     })
     let findOwnerDetails = await sequelize.query(`
      select o.ownershipDetailId,o.firstName,o.lastName,o.phoneNo as phoneNumber,
      o.emailId as emailAddress, o.ownerPanCardNumber as ownerPanCard,o.ownerAddress as ownersAddress,
      o.isFacilityByBda as facilityisownedbBDA 
      from amabhoomi.ownershipdetails o 
      inner join facilities f on f.ownershipDetailId = o.ownershipDetailId 
      where f.facilityId= ? and o.statusId = ?`,
      { replacements:[facilityId,statusId],
       type:QueryTypes.SELECT}
     )
     let findInventoryDetails = await sequelize.query(`select i.equipmentfacilityId as equipmentId ,i.count, i2.code  from amabhoomi.inventoryfacilities i inner join inventorymasters i2 on i.equipmentId = i2.equipmentId where i.facilityId = ? and i.statusId = ?

      `,
            { replacements:[facilityId,statusId],
             type:QueryTypes.SELECT}
           )
    return res.status(statusCode.SUCCESS.code).json({message:"These are all get facility with respect to Id",
      facilityData:findTheFacilityDetils,
      amenity:findAmenityDetails,
      service:findServiceDetails,
      eventCategory:findEventDetails,
      facilityImageOne:findSingleImage,
      facilityArrayOfImages:findMultipleImages,
      parkInventory:findInventoryDetails,
      game:findActivityDetails,
      ownersAddress:findOwnerDetails
    })
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }
}
const updateFacility = async(req,res)=>{
  let transaction;
  try {
    console.log("Here req", req.body, 'all req data end')
    let statusId =1;
    let userId = req.user.userId;
    let createdDt = new Date();
    let updatedDt = new Date();
    transaction = await sequelize.transaction();
    let { 
      facilityData,
      facilityId,
      facilityTypeId:facilityType,
      operatingDays,  //here operating days will come in the form of array of data i.e. array of  days
      service,  //here services will be given in the form of object 
      amenity, // here amenities will be given in the form of form of object 
      otherAmenities, // here other amenities will be given in the form of string
      additionalDetails,
       fileNames:facilityImage,
      eventCategory,
      game,
      capacity,
      parkInventory,
      // owner details
      ownersAddress} = req.body

      
      
      // let{ facilityName,
      // longitude,
      // latitude,
      // address,
      // pin,
      // otherAmenities,
      // additionalDetails,
      // area,
      // operatingHoursFrom,
      // operatingHoursTo,
      // otherServices,
      // othereventCategory,
      // ownership,
      // helpNumber
      // }
      // = facilityData

      // destructing the owner details
    //   let { ownershipDetailId, 
    //     firstName,
    //     lastName,
    // facilityisownedbBDA,
    //     phoneNumber,
    //     emailAddress:emailAdress,
    //     ownerPanCard,
    //     ownersAddress:ownerAddress} = ownersAddress


      let hasUpdates = false;

      let updateFacilityDataVariable = {}
     
      let updateOwnershipDataVariable = {}
      
   
      if(facilityType){
        updateFacilityDataVariable.facilityTypeId = facilityType
      }
      if(facilityData?.helpNumber){
        updateFacilityDataVariable.helpNumber = facilityData?.helpNumber
      }
      
      if(facilityData?.facilityName){
        updateFacilityDataVariable.facilityname =facilityData?.facilityName
      }
      if(facilityData?.longitude){
        updateFacilityDataVariable.longitude = facilityData?.longitude
      }
      if(facilityData?.latitude){
        updateFacilityDataVariable.latitude = facilityData?.latitude
      }
      if(facilityData?.capacity){
        updateFacilityDataVariable.capacity = facilityData?.capacity
      }
      if(facilityData?.address){
        updateFacilityDataVariable.address = facilityData?.address
      }
      if(facilityData?.pin){
        updateFacilityDataVariable.pin = facilityData?.pin
      }
      if(facilityData?.ownership){
        updateFacilityDataVariable.ownership = facilityData?.ownership
      }
      if(facilityData?.area){
        updateFacilityDataVariable.area = facilityData?.area
      }
      if(facilityData?.operatingHoursFrom){
        updateFacilityDataVariable.operatingHoursFrom = facilityData?.operatingHoursFrom
      }
      if(facilityData?.operatingHoursTo){
        updateFacilityDataVariable.operatingHoursTo = facilityData?.operatingHoursTo
      }
      if(Object.keys(operatingDays).length > 0){
        if(operatingDays?.sun.toString()){
          console.log('1')
          updateFacilityDataVariable.sun = operatingDays.sun 
        }
        if(operatingDays?.mon.toString()){
          updateFacilityDataVariable.mon = operatingDays.mon
        }
        if(operatingDays?.tue.toString()){
          updateFacilityDataVariable.tue = operatingDays.tue 
        }
        if(operatingDays?.wed.toString()){
          updateFacilityDataVariable.wed = operatingDays.wed 
        }
        if(operatingDays?.thu.toString()){
          updateFacilityDataVariable.thu = operatingDays.thu 
        }
        if(operatingDays?.fri.toString()){
          updateFacilityDataVariable.fri = operatingDays.fri 
        }
        if(operatingDays?.sat.toString()){
          updateFacilityDataVariable.sat = operatingDays.sat 
        }
        console.log(updateFacilityDataVariable,'updatethefacilitydatavariable')
      }
    if(facilityData?.othergame){
      updateFacilityDataVariable.otherGames = facilityData?.othergame 
    }
    if(facilityData?.additionalDetails){
      updateFacilityDataVariable.additionalDetails = facilityData?.additionalDetails 
    }
    if(facilityData?.otherServices){
      updateFacilityDataVariable.otherServices = facilityData?.otherServices 
    }
    if(facilityData?.otherAmenities){
      updateFacilityDataVariable.otherAmenities = facilityData?.otherAmenities 
    }
    
    if(facilityData?.othereventCategory){
      updateOwnershipDataVariable.otherEventCategories = facilityData?.othereventCategory 
    }
    if(Object.keys(facilityImage).length > 0){
      let findTheFacilityName = await facilities.findOne({
        where:{[Op.and]:[{statusId:statusId},{facilityId:facilityId}]}
      })
      let facilityName = updateFacilityDataVariable?.facilityname ? updateFacilityDataVariable.facilityname : findTheFacilityName?.facilityname;

      if(Object.keys(facilityImage?.facilityImageOne).length >0){
        let cardFacilityImage = facilityImage.facilityImageOne?.data
        if(facilityImage.facilityImageOne?.fileId!=null && facilityImage.facilityImageOne?.data){
          let findThePreviousFilePath = await file.findOne({
            where:{[Op.and]:[{statusId:statusId},{fileId:facilityImage.facilityImageOne.fileId}]},
            transaction
          })
          if(!findThePreviousFilePath){
            await transaction.rollback();
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
              message:`Something went wrong`
            })
          }
          let oldFilePath = findThePreviousFilePath?.url
          let errors=[];
          let insertionData = {
           id:facilityId,
           name:facilityName,
           fileId:facilityImage.facilityImageOne.fileId
          }
             let subDir = "facilityImages"
          //update the data
          let updateSingleFacilityImage = await imageUpdate(cardFacilityImage,subDir,insertionData,userId,errors,1,transaction,oldFilePath)
          if(errors.length>0){

            await transaction.rollback();

            if(errors.some(error => error.includes("something went wrong"))){
              return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
            }
            return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
          }
          hasUpdates = true
        }
        else if(facilityImage.facilityImageOne?.fileId!=null && !(facilityImage.facilityImageOne?.data)){
          let inActiveStatus= 2;
          let inactiveTheFileId = await file.update({statusId:inActiveStatus,
            updatedBy:userId,
          updatedDt:updatedDt
          },
            { where:{
               fileId:facilityImage.facilityImageOne.fileId
             },
           transaction}
           )
   
           let inActiveTheFileInFileAttachmentTable = await fileattachment.update({
             statusId:inActiveStatus,
             updatedBy:userId,
            updatedDt:updatedDt
           },
         {where:{
           fileId:facilityImage.facilityImageOne.fileId
         },
         transaction
       }
       )
       if(inactiveTheFileId.length == 0 || inActiveTheFileInFileAttachmentTable == 0){
         await transaction.rollback();
         return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
           message:`Something went wrong`
         }) 
        
        }
        hasUpdates = true
      }
        else {
          let insertionData = {
            id:facilityId,
            name:facilityName,
           }
          // create the data
          let entityType = 'facilities'
          let errors = [];
          let subDir = "facilityImages"
          let filePurpose = "singleFacilityImage"
          let uploadSingleFacilityImage = await imageUpload(cardFacilityImage,entityType,subDir,filePurpose,insertionData,userId,errors,1,transaction)
          console.log( uploadSingleFacilityImage,'165 line facility image')
          if(errors.length>0){
            await transaction.rollback();
            if(errors.some(error => error.includes("something went wrong"))){
              return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
            }
            return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
          }
          hasUpdates = true
          
        }
      }
      // facility array of images
        if(facilityImage?.facilityArrayOfImages.length>0){
          console.log('inside facility array of images')
          let i = 0;
          for (let facilityArrayOfImage of facilityImage.facilityArrayOfImages){
            let multipleFacilityImage = facilityArrayOfImage?.data
            if(facilityArrayOfImage?.fileId!=null && multipleFacilityImage){
              let findThePreviousFilePath = await file.findOne({
                where:{[Op.and]:[{statusId:statusId},{fileId:facilityImage.facilityImageOne.fileId}]},transaction
              })
              let oldFilePath = findThePreviousFilePath?.url
              let errors=[];
              let insertionData = {
               id:createFacilities.facilityId,
               name:facilityName,
               fileId:facilityArrayOfImage.fileId
              }
              let subDir = "facilityImageList"
              //update the data
              let updateSingleFacilityImage = await imageUpdate(multipleFacilityImage,subDir,insertionData,userId,errors,i+1,transaction,oldFilePath)
              if(errors.length>0){
                await transaction.rollback();

                if(errors.some(error => error.includes("something went wrong"))){
                  return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
                }
                return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
              }
              hasUpdates = true
            }
            else{
              if(facilityArrayOfImage?.fileId!=null && !multipleFacilityImage){
                  let [inactiveStatusFileTableCount] = await file.update({statusId:2,updatedBy:userId,
                    updatedDt:updatedDt},{
                    where:{
                      fileId:facilityArrayOfImage.fileId
                    },
                    transaction
                  }) 
                  let [inactiveStatusFileAttachementTableCount] = await fileattachment.update({statusId:2,updatedBy:userId,
                    updatedDt:updatedDt},{
                    where:{
                      fileId:facilityArrayOfImage.fileId
                    },
                    transaction
                  }) 
                  
                  if(inactiveStatusFileAttachementTableCount==0 || inactiveStatusFileTableCount ==0){
                    await transaction.rollback();
                    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                      message:`something went wrong`
                    })
                  }
                  hasUpdates = true
              }
              else{
                let insertionData = {
                  id:facilityId,
                  name:facilityName,
                 }
              // create the data
              let entityType = 'facilities'
              let errors = [];
              let subDir = "facilityImageList"
              let filePurpose = "multipleFacilityImage"
              let uploadSingleFacilityImage = await imageUpload(multipleFacilityImage,entityType,subDir,filePurpose,insertionData,userId,errors,i+1,transaction)
              console.log( uploadSingleFacilityImage,'165 line facility image')
              if(errors.length>0){

                await transaction.rollback();

                if(errors.some(error => error.includes("something went wrong"))){
                  return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
                }
                return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
              }
              hasUpdates = true
            }
              
            }
            i +=1  // to put this value in the file table
          }
         
        }
    
    // removed array of image
    if(facilityImage?.removedFacilityImagesArray.length>0){
      console.log('inside facility removed array of  images')
      let i = 0;
      for (let facilityArrayOfImage of facilityImage.removedFacilityImagesArray){
       
          if(facilityArrayOfImage?.fileId!=null){
              let [inactiveStatusFileTableCount] = await file.update({statusId:2,updatedBy:userId,
                updatedDt:updatedDt},{
                where:{
                  fileId:facilityArrayOfImage.fileId
                },
                transaction
              }) 
              let [inactiveStatusFileAttachementTableCount] = await fileattachment.update({statusId:2,updatedBy:userId,
                updatedDt:updatedDt},{
                where:{
                  fileId:facilityArrayOfImage.fileId
                },
                transaction
              }) 
              
              if(inactiveStatusFileAttachementTableCount==0 || inactiveStatusFileTableCount ==0){
                await transaction.rollback();
                return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                  message:`something went wrong`
                })
              }
              hasUpdates = true
          }
       }
     
    }
    // 
      
  } 

    if(service.length>0){
    
      for (let eachService of service){
        let checkIfTheGivenServicePresent = await serviceFacility.findOne({
          where:{
            [Op.and]:[{statusId:statusId},{serviceId:eachService},{facilityId:facilityId}]}
        },
      transaction)
        if(!checkIfTheGivenServicePresent){
          
          let insertToServiceFacility = await serviceFacility.create({
            statusId:statusId,
            serviceId:eachService,
            facilityId:facilityId,
            createdBy:userId,
            updatedBy:userId,
            updatedDt:updatedDt,
            createdDt:createdDt,
          },
          {transaction})
          if(!insertToServiceFacility){
            await transaction.rollback();
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
              message:"Something went wrong"
            })
          }
          hasUpdates = true
      }
    }

    let findAllServiceFacility = await serviceFacility.findAll({
      where:{
        [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
      },
      transaction
    })
    for (let eachService of findAllServiceFacility){
     
        if(!service.includes(eachService.serviceId)){
          let inactiveTheRecord = await serviceFacility.update({
            statusId:2,
            updatedBy:userId,
            updatedDt:updatedDt
          },
      { 
        where:{
          [Op.and]:[{serviceId:eachService.serviceId},{facilityId:facilityId}]
        },
        transaction
        })
        if(inactiveTheRecord==0){
          await transaction.rollback();
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:"Something went wrong"
          })
        }
        hasUpdates = true
          // 
        }
      
        
      }
    }
    if(service.length==0){
      let findAllServiceFacility = await serviceFacility.findAll({
        where:{
          [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
        },
        transaction
      })
      if(findAllServiceFacility.length > 0){
        let inactiveTheRecord = await serviceFacility.update({
          statusId:2,
          updatedBy:userId,
          updatedDt:updatedDt
        },
    { 
      where:{
        [Op.and]:[{facilityId:facilityId},{statusId:statusId}]
      },
      transaction
      })
      if(inactiveTheRecord==0){
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:"Something went wrong"
        })
      }
      hasUpdates = true
      }
     
    }


    if(parkInventory.length>0){
    
      for (let eachInventory of parkInventory){
        let checkIfTheGivenInventoryPresent = await inventoryFacilities.findOne({
          where:{
            [Op.and]:[{statusId:statusId},{equipmentId:eachInventory.equipmentId},{facilityId:facilityId}]}
        },
      transaction)
        if(!checkIfTheGivenInventoryPresent){
          let insertToInventoryFacility = await inventoryFacilities.create({
            statusId:statusId,
            equipmentId:eachInventory.equipmentId,
            facilityId:facilityId,
            count:eachInventory.count,
            createdBy:userId,
            updatedBy:userId,
            updatedDt:updatedDt,
            createdDt:createdDt,
          },
          {transaction})
          if(!insertToInventoryFacility){
            await transaction.rollback();
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
              message:"Something went wrong"
            })
          }
          hasUpdates = true
      }
      else{
        // update the inventory
        // check the inventory count
        if(eachInventory.count != checkIfTheGivenInventoryPresent.count){
          let [updateTheInventoryCount] = await inventoryFacilities.update({
            count:eachInventory.count,
            updatedBy:userId,
            updatedDt:updatedDt
          },
        {where:{[Op.and]:[{equipmentId:checkIfTheGivenInventoryPresent.equipmentId},{facilityId:checkIfTheGivenInventoryPresent.facilityId}]
          
        }})
        if(updateTheInventoryCount == 0){
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:`Something went wrong`
          })
        }

        hasUpdates = true
        
        }
      }
    }

    let findAllInventoryFacility = await inventoryFacilities.findAll({
      where:{
        [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
      },
      transaction
    })
    for (let eachInventory of findAllInventoryFacility){
        let checkIfIdPresent = parkInventory.every(eachOne=>eachOne.equipmentId == eachInventory.equipmentId);
        if(!checkIfIdPresent){
          let inactiveTheRecord = await inventoryFacilities.update({
            statusId:2,
            updatedBy:userId,
            updatedDt:updatedDt
          },
      { 
        where:{
          [Op.and]:[{equipmentId:eachInventory.equipmentId},{facilityId:facilityId}]
        },
        transaction
        })
        if(inactiveTheRecord==0){
          await transaction.rollback();
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:"Something went wrong"
          })
        }
        hasUpdates = true
      
        }
        
        
      }
    }
    if(parkInventory.length == 0){
      let findAllInventoryFacility = await inventoryFacilities.findAll({
        where:{
          [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
        },
        transaction
      })
      if(findAllInventoryFacility.length > 0){
        let inactiveTheRecord = await inventoryFacilities.update({
          statusId:2,
          updatedBy:userId,
          updatedDt:updatedDt
        },
    { 
      where:{
        [Op.and]:[{facilityId:facilityId},{statusId:statusId}]
      },
      transaction
      })
      if(inactiveTheRecord==0){
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:"Something went wrong"
        })
      }
      hasUpdates = true
      }

    }
    if(amenity.length>0){
    
      for (let eachAmenity of amenity){
        let checkIfTheGivenAmenityPresent = await amenityFacility.findOne({
          where:{
            [Op.and]:[{statusId:statusId},{amenityId:eachAmenity},{facilityId:facilityId}]}
        },
      transaction)
        if(!checkIfTheGivenAmenityPresent){
          let insertToAmenityFacility = await amenityFacility.create({
            statusId:statusId,
            amenityId:eachAmenity,
            facilityId:facilityId,
            createdBy:userId,
            updatedBy:userId,
            updatedDt:updatedDt,
            createdDt:createdDt,
          },
          {transaction})
          if(!insertToAmenityFacility){
            await transaction.rollback();
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
              message:"Something went wrong"
            })
          }
          hasUpdates = true
        
      }
    }

    let findAllAmenityFacility = await amenityFacility.findAll({
      where:{
        [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
      },
      transaction
    })
    for (let eachAmenity of findAllAmenityFacility){
        if(!amenity.includes(eachAmenity.amenityId)){
          let inactiveTheRecord = await amenityFacility.update({
            statusId:2,
            updatedBy:userId,
            updatedDt:updatedDt
          },
      { 
        where:{
          [Op.and]:[{amenityId:eachAmenity.amenityId},{facilityId:facilityId}]
        },
        transaction
        })
        if(inactiveTheRecord==0){
          await transaction.rollback();
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:"Something went wrong"
          })
        }
        hasUpdates = true
        }
        
        
      }
    }
    if(amenity.length==0){
      let findAllAmenityFacility = await amenityFacility.findAll({
        where:{
          [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
        },
        transaction
      })
      if(findAllAmenityFacility.length>0){
        let inactiveTheRecord = await amenityFacility.update({
          statusId:2,
          updatedBy:userId,
          updatedDt:updatedDt
        },
    { 
      where:{
        [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
      },
      transaction
      })
      if(inactiveTheRecord==0){
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:"Something went wrong"
        })
      }
      hasUpdates = true
      }
      
    }
    if(game.length>0){
      
    if(!facilityType){
      let findfacilityTypeId = await facilities.findOne({
        where:{
          [Op.and]:[{facilityId:facilityId},{statusId:statusId}]
        },
        transaction
      })
      updateFacilityDataVariable.facilityTypeId = findfacilityTypeId.facilityTypeId
    }
      for (let eachActivity of game){
        let checkIfTheGivenActivityPresent = await facilityAcitivities.findOne({
          where:{
            [Op.and]:[{statusId:statusId},{activityId:eachActivity},{facilityId:facilityId}]}
        },
      transaction)
        if(!checkIfTheGivenActivityPresent){
          
          let insertToActivityFacility = await facilityAcitivities.create({
            statusId:statusId,
            activityId:eachActivity,
            facilityTypeId:updateFacilityDataVariable.facilityTypeId,
            facilityId:facilityId,
            createdBy:userId,
            updatedBy:userId,
            updatedDt:updatedDt,
            createdDt:createdDt,
          },
          {transaction})

          if(!insertToActivityFacility){
            await transaction.rollback();
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
              message:"Something went wrong"
            })
          }
          hasUpdates = true
      }
    }

    let findAllActivityFacility = await facilityAcitivities.findAll({
      where:{
        [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
      },
      transaction
    })
    for (let eachActivity of findAllActivityFacility){
        
        if(!game.includes(eachActivity.activityId)){
          let inactiveTheRecord = await facilityAcitivities.update({
            statusId:2,
            updatedBy:userId,
            updatedDt:updatedDt
          },
      { 
        where:{
          [Op.and]:[{activityId:eachActivity.activityId},{facilityId:facilityId}]
        },
        transaction
        })
        if(inactiveTheRecord==0){
          await transaction.rollback();
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:"Something went wrong"
          })
        }
        hasUpdates = true
      }
        
      }
    }
    if(game.length == 0){
      let findAllActivityFacility = await facilityAcitivities.findAll({
        where:{
          [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
        },
        transaction
      })
      if(findAllActivityFacility.length >0){
        let inactiveTheRecord = await facilityAcitivities.update({
          statusId:2,
          updatedBy:userId,
          updatedDt:updatedDt
        },
      { 
        where:{
          [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
        },
        transaction
        })
        if(inactiveTheRecord==0){
          await transaction.rollback();
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:"Something went wrong"
          })
        }
        hasUpdates = true
      }
      

    }
    if(eventCategory.length>0){
        for (let eachEvent of eventCategory){
          let checkIfTheGivenEventPresent = await facilityEvent.findOne({
            where:{
              [Op.and]:[{statusId:statusId},{eventCategoryId:eachEvent},{facilityId:facilityId}]}
          },
        transaction)
          if(!checkIfTheGivenEventPresent){
            
            let insertToEventFacility = await facilityEvent.create({
              statusId:statusId,
              eventCategoryId:eachEvent,
              facilityId:facilityId,
              createdBy:userId,
              updatedBy:userId,
              updatedDt:updatedDt,
              createdDt:createdDt,
            },
            {transaction})
            if(!insertToEventFacility){
              await transaction.rollback();
              return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:"Something went wrong"
              })
            }
            hasUpdates = true
        }
      }
    
      let findAllEventFacility = await facilityEvent.findAll({
        where:{
          [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
        },
        transaction
      })
      for (let eachEvent of findAllEventFacility){
          
          if(!eventCategory.includes(eachEvent.eventCategoryId)){
            let inactiveTheRecord = await facilityEvent.update({
              statusId:2,
              updatedBy:userId,
              updatedDt:updatedDt
            },
        { 
          where:{
            [Op.and]:[{eventCategoryId:eachEvent.eventCategoryId},{facilityId:facilityId}]
          },
          transaction
          })
          if(inactiveTheRecord==0){
            await transaction.rollback();
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
              message:"Something went wrong"
            })
          }
          hasUpdates = true
        }
          
        }
    }
    if(eventCategory.length == 0){
      let findAllEventFacility = await facilityEvent.findAll({
        where:{
          [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
        },
        transaction
      })
      if(findAllEventFacility.length > 0){
        let inactiveTheRecord = await facilityEvent.update({
          statusId:2,
          updatedBy:userId,
          updatedDt:updatedDt
        },
    { 
      where:{
        [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
      },
      transaction
      })
      if(inactiveTheRecord==0){
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:"Something went wrong"
        })
      }
      hasUpdates = true
      }
      
    }
    if(ownersAddress?.firstName){
      updateOwnershipDataVariable.firstName = ownersAddress?.firstName
    }
    if(ownersAddress?.lastName){
      updateOwnershipDataVariable.lastName = ownersAddress?.lastName
    }
    if(ownersAddress?.phoneNumber){
      let checkIfPhoneNumberExist = await ownershipDetails.findOne({
        where:{[Op.and]:[{statusId:statusId},{phoneNo:ownersAddress?.phoneNumber}]},
        transaction
      
      });
      console.log('checkIfPhoneNumberExist ',checkIfPhoneNumberExist)
      if(!checkIfPhoneNumberExist){ 
        console.log('inside phone number')
        updateOwnershipDataVariable.phoneNo = ownersAddress?.phoneNumber
    }
      else if(ownersAddress?.emailAddress){
        console.log('inside emailAddress change',checkIfPhoneNumberExist)
        if(checkIfPhoneNumberExist.emailId == ownersAddress?.emailAddress){
          console.log('inside emailAddres', checkIfPhoneNumberExist);
          updateFacilityDataVariable.ownershipDetailId = checkIfPhoneNumberExist.ownershipDetailId
          ownersAddress.ownershipDetailId = checkIfPhoneNumberExist.ownershipDetailId 
        }
        else{
          await transaction.rollback()
          return res.status(statusCode.BAD_REQUEST.code).json({
            message:"This phone is already allocated"
          })
        }
    }
      
    }
    if(ownersAddress?.emailAddress){

      let checkIfEmailExist = await ownershipDetails.findOne({
        where:{[Op.and]:[{statusId:statusId},{emailId:ownersAddress?.emailAddress}]},
        transaction
      
      });
      if(!checkIfEmailExist){ 
        updateOwnershipDataVariable.emailId = ownersAddress?.emailAddress
    }
      else if(ownersAddress?.phoneNumber){
        if(checkIfEmailExist.phoneNo == ownersAddress?.phoneNumber){
          updateFacilityDataVariable.ownershipDetailId = checkIfEmailExist.ownershipDetailId
          ownersAddress.ownershipDetailId = checkIfEmailExist.ownershipDetailId
        }
        else{
          await transaction.rollback()
          return res.status(statusCode.BAD_REQUEST.code).json({
            message:"This email is already allocated"
          })
        }
    }
      
    }
    if(ownersAddress?.ownerPanCard){
      let checkIfPanCardExist = await ownershipDetails.findOne({
        where:{
          [Op.and]:[{ownerPanCardNumber:ownersAddress?.ownerPanCard},{statusId:statusId}]
        },
        transaction
      })
      if(!checkIfPanCardExist){
        updateOwnershipDataVariable.ownerPanCardNumber = ownersAddress?.ownerPanCard
      }
      else if (ownersAddress?.phoneNumber){
        let checkIfPhoneNumberExist = await ownershipDetails.findOne({
          where:{[Op.and]:[{statusId:statusId},{phoneNo:ownersAddress?.phoneNumber}]},
          transaction
        });
          if(checkIfPhoneNumberExist.phoneNo == ownersAddress?.phoneNumber){
            updateFacilityDataVariable.ownershipDetailId = checkIfPhoneNumberExist.ownershipDetailId
            ownersAddress.ownershipDetailId = checkIfPhoneNumberExist.ownershipDetailId
          }
          else{
            await transaction.rollback()
            return res.status(statusCode.BAD_REQUEST.code).json({
              message:"This pan number is already allocated"
            })
          }
    }

  }
    if(ownersAddress?.ownersAddress){
      updateOwnershipDataVariable.ownerAddress = ownersAddress?.ownersAddress
    }
    if(ownersAddress?.facilityisownedbBDA){
      updateOwnershipDataVariable.isFacilityByBda = ownersAddress?.facilityisownedbBDA
    }
    if(Object.keys(updateOwnershipDataVariable).length>0){
      updateOwnershipDataVariable.updatedDt = updatedDt
      updateOwnershipDataVariable.updatedBy = userId
      let [updateOwnershipDataVariableCount] = await ownershipDetails.update(updateOwnershipDataVariable,{where:{
        ownershipDetailId: ownersAddress?.ownershipDetailId
      },
      transaction
    })
      if(updateOwnershipDataVariableCount==0){
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:`Something went wrong`
        })
      }
      hasUpdates = true

    }
    if(Object.keys(updateFacilityDataVariable).length>0){
      updateFacilityDataVariable.updatedDt = updatedDt
      updateFacilityDataVariable.updatedBy = userId
      let [updateFacilityDataCount] = await facilities.update(updateFacilityDataVariable,{where:{
        facilityId:facilityId
      },transaction})

      console.log(updateFacilityDataVariable,'updatefacilitydata variable')

      if(updateFacilityDataCount==0){
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:`Something went wrong`
        })
      }
      hasUpdates = true
   }
   if(hasUpdates){
    await transaction.commit();
    return res.status(statusCode.SUCCESS.code).json({message:"Data updated successfully"})
   }
  else{
    await transaction.rollback();
    return res.status(statusCode.BAD_REQUEST.code).json({
      message:`Data is not updated`
    })
  }


}catch (err) {
  if(transaction) await transaction.rollback();
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }
}



module.exports= {
    registerFacility,
    initialDataFetch,
    getFacilityWrtId,
    updateFacility
}