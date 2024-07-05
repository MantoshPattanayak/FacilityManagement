

const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const facilities = db.facilities;
const facilityType = db.facilitytype
const facilityTariff = db.facilitytariff
let tarifftype = db.tarifftype
let tariffmaster = db.tariffmaster
const Sequelize = db.Sequelize;
let {Op} = require('sequelize')
let faciltyActivity = db.facilityactivities;
let facilityEvents = db.facilityEvents;
let useractivitymaster = db.useractivitymasters
let eventcategorymaster = db.eventCategoryMaster
// create tariff api
let createTariff = async (req,res)=>{
    let transaction 
    try {
        console.log('req body',req.body)
        let createdDt = new Date();
        let updatedDt = new Date();
        let userId = req.user.userId
        let statusId = 1;
        let {facilityTariffData} = req.body
        let tariffCreationData;
        // let {facilityId, operatingHoursFrom, operatingHoursTo, dayWeek, amount, validityFrom, validityTo }= req.body
         transaction = await sequelize.transaction();

        if(facilityTariffData.length==0 || facilityTariffData.some((tariffData)=>{!tariffData.facilityId || !tariffData.operatingHoursFrom || !tariffData.operatingHoursTo  || !tariffData.dayWeek   || !tariffData.validityFrom  || !tariffData.validityTo ||  !tariffData.tariffTypeId || !tariffData.entityId})){
            return res.status(statusCode.BAD_REQUEST.code).json({
                message:"Please provide all required fields"
            })
        }
        let tariffMasterCreationData;
        console.log('each tariff object line 38')
        facilityTariffData.forEach(async(eachTariffObject) => {
            console.log('each tariff object', eachTariffObject)
            let findOutIfTheTariffAlreadyPresentOrNot  = await tariffmaster.findOne({
                where:{[Op.and]:[{facilityId:eachTariffObject.facilityId}, {entityId:eachTariffObject.entityId},{tariffTypeId:eachTariffObject.tariffTypeId},{statusId:statusId}]},  
                transaction 
            })
            console.log('find out if the tariff', findOutIfTheTariffAlreadyPresentOrNot)
            let tariffMasterQuery // for inserting the data to tariff masters
            if(!findOutIfTheTariffAlreadyPresentOrNot){
                tariffMasterCreationData = {
                    facilityId:eachTariffObject.facilityId,
                    entityId:eachTariffObject.entityId,
                    tariffTypeId:eachTariffObject.tariffTypeId,
                    statusId:statusId,
                    createdBy:userId,
                    createdDt:createdDt,
                    updatedBy:userId,
                    updatedDt:updatedDt
                }
    
             tariffMasterQuery = await tariffmaster.create(tariffMasterCreationData,{ transaction, returning: true  })
             console.log('tariff master query', tariffMasterQuery)
            }
            else{
                 tariffMasterQuery = {};
                tariffMasterQuery.tariffMasterId = findOutIfTheTariffAlreadyPresentOrNot.tariffMasterId;
            }
           
            console.log('hello 67 line')
             tariffCreationData = {
                facilityId:eachTariffObject.facilityId,
                tariffMasterId:tariffMasterQuery.tariffMasterId,
                operatingHoursFrom:eachTariffObject.operatingHoursFrom,
                operatingHoursTo:eachTariffObject.operatingHoursTo,
                sun:eachTariffObject.dayWeek.sun,
                mon:eachTariffObject.dayWeek.mon,
                tue:eachTariffObject.dayWeek.tue,
                wed:eachTariffObject.dayWeek.wed,
                thu:eachTariffObject.dayWeek.thu,
                fri:eachTariffObject.dayWeek.fri,
                sat:eachTariffObject.dayWeek.sat,
                validityFrom:eachTariffObject.validityFrom,
                validityTo:eachTariffObject.validityTo,
                createdBy:userId,
                createdDt:new Date(),
                updatedBy:userId,
                updatedDt:new Date(),
                statusId:statusId
            }
            console.log('hello 88 line', tariffCreationData)

            let findIfTheFacilityId = await facilityTariff.findOne({
                where: {
                    [Op.and]: [
                        {
                            validityFrom: {
                                [Op.lte]: eachTariffObject.validityFrom
                            }
                        },
                        {
                            validityTo: {
                                [Op.gte]: eachTariffObject.validityFrom
                            }
                        },
                        {
                            statusId: statusId
                        },
                        {
                            tariffMasterId:tariffMasterQuery.tariffMasterId
                        }
                        ,
                        {
                            facilityId: eachTariffObject.facilityId
                        },
                        {
                            operatingHoursFrom: {
                                [Op.lte]: eachTariffObject.operatingHoursFrom
                            }
                        },
                        {
                            operatingHoursTo: {
                                [Op.gte]: eachTariffObject.operatingHoursFrom
                            }
                        }
                    ]
                },  transaction 
            });

            
        console.log(findIfTheFacilityId,'findif the facilityId')

        if(findIfTheFacilityId){
            return res.status(statusCode.BAD_REQUEST.code).json({
                message:"This data is already present"
            })
        }
    
        let createTariffData = await facilityTariff.create(tariffCreationData,{ transaction, returning: true  })

        await transaction.commit(); // If everything goes well, will do the commit here

        if(createTariffData){
            return res.status(statusCode.SUCCESS.code).json({
                message:"This data is successfully inserted"
            })
        }
        else{
            if(transaction) await transaction.rollback();
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json('Something went wrong')
        }


        }
    );
        
      

    } catch (err) {
        if(transaction) await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
           message: err.message
        })
    }
}

let getTariffById = async (req,res)=>{
    try {
        console.log('1',req.params)
        let statusId = 1;
        let tariffId = req.params.tariffId
        console.log(tariffId,'tariffId')
        let findTariffById = await facilityTariff.findOne({
            where:{
                [Op.and]:[{tariffMasterId:tariffId},{statusId:statusId}]
            },
            include:[{
                model:facilities
            }]
        })
        if(findTariffById){
            return res.status(statusCode.SUCCESS.code).json({
                message:"Here is the tariff Data",
                tariffData:findTariffById
            })
        }
        return res.status(statusCode.BAD_REQUEST.code).json({
            message:"Invalid Request"
        })
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
    })
}
}


let updateTariff = async (req,res)=>{
    try {
        let {facilityTariffData} = req.body
        let statusId = 1;
        if(facilityTariffData.length>0 || facilityTariffData.some((tariffData)=>{!tariffData.facilityId || !tariffData.facilityId || !tariffData.operatingHoursFrom || !tariffData.operatingHoursTo  || !tariffData.dayWeek || !tariffData.validityFrom  || !tariffData.validityTo || !tariffData.statusId || !tariffData.tariffMasterId || !tariffData.tariffDetailId})){
            return res.status(statusCode.BAD_REQUEST.code).json({
                message:"Please provide all required fields"
            })
        }
        // let {tariffId,facilityId, operatingHoursFrom, operatingHoursTo, dayWeek, amount, validityFrom, validityTo,statusId }= req.body
        facilityTariffData.forEach(async(eachTariffObject) => {
            let findTariffById = await facilityTariff.findOne({
                where:{
                    [Op.and]:[{tariffMasterId:eachTariffObject.tariffId},{statusId:statusId}]
                }
            })
            let updateDataForTariff ={}
            if(eachTariffObject.facilityId!=findTariffById.facilityId){
                let findIfDuplicateTariffFacilityExist = await facilityTariff.findOne({
                    where:{
                        [Op.and]: [
                            {
                                validityFrom: {
                                    [Op.lte]: eachTariffObject.validityFrom
                                }
                            },
                            {
                                validityTo: {
                                    [Op.gte]: eachTariffObject.validityFrom
                                }
                            },
                            {
                                statusId: statusId
                            },
                            {
                                tariffMasterId:eachTariffObject.tariffMasterId
                            },
                            {
                                facilityId: eachTariffObject.facilityId
                            },
                            {
                                operatingHoursFrom: {
                                    [Op.lte]: eachTariffObject.operatingHoursFrom
                                }
                            },
                            {
                                operatingHoursTo: {
                                    [Op.gte]: eachTariffObject.operatingHoursFrom
                                }
                            }
                        ]
                    }
                })
                if(findIfDuplicateTariffFacilityExist){
                    return res.status(statusCode.BAD_REQUEST.code).json({
                        message:"This facilityId is already mapped to one tariff. Please deactivate the status for the given facility Id"
                    })
                }
                updateDataForTariff.facilityId = eachTariffObject.facilityId
            }
            if(eachTariffObject.operatingHoursFrom!=findTariffById.operatingHoursFrom){
                let findIfDuplicateTariffFacilityExist = await facilityTariff.findOne({
                    where:{
                        [Op.and]: [
                            {
                                validityFrom: {
                                    [Op.lte]: eachTariffObject.validityFrom
                                }
                            },
                            {
                                validityTo: {
                                    [Op.gte]: eachTariffObject.validityFrom
                                }
                            },
                            {
                                statusId:statusId
                            },
                            {
                                tariffMasterId:eachTariffObject.tariffMasterId
                            },
                            {
                                facilityId: eachTariffObject.facilityId
                            },
                            {
                                operatingHoursFrom: {
                                    [Op.lte]: eachTariffObject.operatingHoursFrom
                                }
                            },
                            {
                                operatingHoursTo: {
                                    [Op.gte]: eachTariffObject.operatingHoursFrom
                                }
                            }
                        ]
                    }
                })
                if(findIfDuplicateTariffFacilityExist){
                    return res.status(statusCode.BAD_REQUEST.code).json({
                        message:"This facilityId is already mapped to one tariff. Please deactivate the status for the given facility Id"
                    })
                }
                console.log('2')
                updateDataForTariff.operatingHoursFrom = eachTariffObject.operatingHoursFrom
            }
            if(eachTariffObject.operatingHoursTo!=findTariffById.operatingHoursTo){
                updateDataForTariff.operatingHoursTo = eachTariffObject.operatingHoursTo
    
            }
            if(eachTariffObject.dayWeek.sun!=findTariffById.sun){
                updateDataForTariff.sun = eachTariffObject.dayWeek.sun 
            }
            if(eachTariffObject.dayWeek.mon!=findTariffById.mon){
                updateDataForTariff.mon = eachTariffObject.dayWeek.mon
            }
            if(eachTariffObject.dayWeek.tue!=findTariffById.tue){
                updateDataForTariff.tue = eachTariffObject.dayWeek.tue
            }
            if(eachTariffObject.dayWeek.wed!=findTariffById.wed){
                updateDataForTariff.wed = eachTariffObject.dayWeek.wed
            }
            if(eachTariffObject.dayWeek.thu!=findTariffById.thu){
                updateDataForTariff.thu = eachTariffObject.dayWeek.thu
            }
            if(eachTariffObject.dayWeek.fri!=findTariffById.fri){
                updateDataForTariff.fri = eachTariffObject.dayWeek.fri
            }
            if(eachTariffObject.dayWeek.sat!=findTariffById.sat){
                updateDataForTariff.sat = eachTariffObject.dayWeek.sat
            }
          
            if(eachTariffObject.statusId!=findTariffById.statusId){
                updateDataForTariff.statusId = eachTariffObject.statusId
            }
            if(eachTariffObject.validityFrom!=findTariffById.validityFrom){
                console.log('25345345353')
    
                let findIfDuplicateTariffFacilityExist = await facilityTariff.findOne({
                    where:{
                        [Op.and]: [
                            {
                                validityFrom: {
                                    [Op.lte]: eachTariffObject.validityFrom
                                }
                            },
                            {
                                validityTo: {
                                    [Op.gte]: eachTariffObject.validityFrom
                                }
                            },
                            {
                                statusId: statusId
                            },
                            {
                                tariffMasterId:eachTariffObject.tariffMasterId
                            },
                            {
                                facilityId: eachTariffObject.facilityId
                            },
                            {
                                operatingHoursFrom: {
                                    [Op.lte]: eachTariffObject.operatingHoursFrom
                                }
                            },
                            {
                                operatingHoursTo: {
                                    [Op.gte]: eachTariffObject.operatingHoursFrom
                                }
                            }
                        ]
                    }
                })
                if(findIfDuplicateTariffFacilityExist){
                    return res.status(statusCode.BAD_REQUEST.code).json({
                        message:"This facilityId is already mapped to one tariff. Please deactivate the status for the given facility Id"
                    })
                }
                updateDataForTariff.validityFrom = eachTariffObject.validityFrom
            }
            if(eachTariffObject.tariffMasterId!=findTariffById.tariffMasterId){
                console.log('25345345353')
    
                let findIfDuplicateTariffFacilityExist = await facilityTariff.findOne({
                    where:{
                        [Op.and]: [
                            {
                                validityFrom: {
                                    [Op.lte]: eachTariffObject.validityFrom
                                }
                            },
                            {
                                validityTo: {
                                    [Op.gte]: eachTariffObject.validityFrom
                                }
                            },
                            {
                                statusId: statusId
                            },
                            {
                                tariffMasterId:eachTariffObject.tariffMasterId
                            },
                            {
                                facilityId: eachTariffObject.facilityId
                            },
                            {
                                operatingHoursFrom: {
                                    [Op.lte]: eachTariffObject.operatingHoursFrom
                                }
                            },
                            {
                                operatingHoursTo: {
                                    [Op.gte]: eachTariffObject.operatingHoursFrom
                                }
                            }
                        ]
                    }
                })
                if(findIfDuplicateTariffFacilityExist){
                    return res.status(statusCode.BAD_REQUEST.code).json({
                        message:"This facilityId is already mapped to one tariff. Please deactivate the status for the given facility Id"
                    })
                }
                updateDataForTariff.tariffMasterId = eachTariffObject.tariffMasterId
            }
            if(validityTo!= findTariffById.validityTo){
                updateDataForTariff.validityTo = eachTariffObject.validityTo
            }
            if(eachTariffObject){
                updateDataForTariff.updatedBy = userId
                updateDataForTariff.updatedDt = new Date()
            }
            let [updateTariffCount, updateTariffData] = await facilityTariff.update(updateDataForTariff,{
                where:{
                    tariffMasterId:eachTariffObject.tariffId
                }
            })
            if(updateTariffCount>0){
                return res.status(statusCode.SUCCESS.code).json({
                    message:"Data updated successfully"
                })
            }
            return res.status(statusCode.BAD_REQUEST.code).json({
                message:"Data is not updated"
            })
        })

        
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
    })
}
}

let viewTariff = async (req,res)=>{
    try {
        let limit = req.body.page_size ? req.body.page_size : 500;
        let page = req.body.page_number ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
        let givenReq = req.body.givenReq ? req.body.givenReq : null;
        let statusId = 1;
        let findViewTariff
        if(givenReq){
             findViewTariff = await facilities.findAll({
                where:{
                   [Op.and]: [{statusId:statusId},{facilityTypeId:givenReq}]
                }
            });
        }
        else{
            findViewTariff = await facilities.findAll({
                where:{
                    statusId:statusId
                }
            });
        }

        let paginatedTariff = findViewTariff.slice(offset, offset + limit);

        return res.status(statusCode.SUCCESS.code).json({message:"All Tariff Data", tariffData:paginatedTariff})
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}

let initialDataForTariffSelectionWRTCategory = async (req,res)=>{
    try {
        let {facilityId,tariffTypeId} = req.body
        let statusId =1;
        let findTheNameOfThoseActivities;
        let findTheNameOfThoseSports;
        let findTheNameOfThoseEvents;
        let findFacilityTypeIdFromFacilityTable
        let tariffTypeQuery = await tarifftype.findAll({where:{statusId:statusId}})
        if(facilityId){
             findFacilityTypeIdFromFacilityTable = await facilities.findOne({
                where:{
                   [Op.and]:[ {statusId:statusId},{facilityId:facilityId}]
                }
            })
        }
   
        if(facilityId && tariffTypeId==1){
             findTheNameOfThoseActivities = await faciltyActivity.findAll({
                where:{
                    [Op.and]:[{facilityTypeId:{[Op.ne]:2}},{statusId:statusId},{facilityId:facilityId}]
                },
                include: [{
                    model: useractivitymaster
                    // Add any additional options for the included model here if needed
                }]
        
    })
        }
        if(findFacilityTypeIdFromFacilityTable?.facilityTypeId == 2 && facilityId && tariffTypeId==2){
           
                findTheNameOfThoseSports = await faciltyActivity.findAll({
                   where:{[Op.and]:[{facilityTypeId:{[Op.eq]:2}},{statusId:statusId},{facilityId:facilityId}]
           },
           include:[
           { model: useractivitymaster
            // Add any additional options for the included model here if needed
            }
           ]
        }
       )
        }
        if(facilityId && tariffTypeId==3){
           
            findTheNameOfThoseEvents = await facilityEvents.findAll({
               where:{[Op.and]:[{facilityTypeId:{[Op.eq]:2}},{statusId:statusId},{facilityId:facilityId}]
       },
       include:[
        { model: eventcategorymaster
         // Add any additional options for the included model here if needed
         }
        ]
    }
   )
    }
        return res.status(statusCode.SUCCESS.code).json({
            message:"Initial Data for tariff",
            tariffTypeData:tariffTypeQuery,
            activityData:findTheNameOfThoseActivities,
            sportsData:findTheNameOfThoseSports,
            eventsData:findTheNameOfThoseEvents
        })   
        
     
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json(err.message)
    }
}
module.exports= {
    createTariff,
    getTariffById,
    updateTariff,
    viewTariff,
    initialDataForTariffSelectionWRTCategory
}