

const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const facilities = db.facilities;
const facilityType = db.facilitytype
const facilityTariff = db.facilitytariff
const Sequelize = db.Sequelize;
let {Op} = require('sequelize')

// create tariff api
let createTariff = async (req,res)=>{
    try {
        let userId = req.user.userId
        let statusId = 1;
        let {facilityId, operatingHoursFrom, operatingHoursTo, dayWeek, amount, validityFrom, validityTo }= req.body
        if(!facilityId && !operatingHoursFrom && !operatingHoursTo && !dayWeek && !amount && !validityFrom && !validityTo){
            return res.status(statusCode.BAD_REQUEST.code).json({
                message:"Please provide all required fields"
            })
        }

        let tariffCreationData = {
            facilityId:facilityId,
            operatingHoursFrom:operatingHoursFrom,
            operatingHoursTo:operatingHoursTo,
            sun:dayWeek.sun,
            mon:dayWeek.mon,
            tue:dayWeek.tue,
            wed:dayWeek.wed,
            thu:dayWeek.thu,
            fri:dayWeek.fri,
            sat:dayWeek.sat,
            amount:amount,
            validityFrom:validityFrom,
            validityTo:validityTo,
            createdBy:userId,
            createdDt:new Date(),
            updatedBy:userId,
            updatedDt:new Date()
        }
        let findIfTheFacilityId = await facilityTariff.findOne({
            where:{
                [Op.and]:[{validityFrom:{
                    [Op.gte]:validityFrom
                }},{validityTo:{
                    [Op.lte]:validityFrom
                }},{statusId:statusId},{facilityId:facilityId},{operatingHoursFrom:{[Op.gte]:operatingHoursFrom }},{operatingHoursTo:{[Op.lte]:operatingHoursFrom }}]
            }
        })

        if(findIfTheFacilityId){
            return res.status(statusCode.BAD_REQUEST.code).json({
                message:"This data is already present"
            })
        }
    
        let createTariffData = await facilityTariff.create(tariffCreationData)

        if(createTariffData){
            return res.status(statusCode.SUCCESS.code).json({
                message:"This data is successfully inserted"
            })
        }
        else{
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json('Something went wrong')
        }
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
           message: err.message
        })
    }
}

let getTariffById = async (req,res)=>{
    try {
        let tariffId = req.params.tariffId
        let findTariffById = await facilityTariff.findOne({
            where:{
                [Op.and]:[{tariffMasterId:tariffId},{statusId:statusId}]
            }
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
        let {tariffId,facilityId, operatingHoursFrom, operatingHoursTo, dayWeek, amount, validityFrom, validityTo,statusId }= req.body

        let findTariffById = await facilityTariff.findOne({
            where:{
                [Op.and]:[{tariffMasterId:tariffId},{statusId:statusId}]
            }
        })
        let updateDataForTariff ={}
        if(facilityId!=findTariffById.facilityId){
            let findIfDuplicateTariffFacilityExist = await facilityTariff.findOne({
                where:{
                    [Op.and]:[{statusId:1},{facilityId:facilityId},{operatingHoursFrom:{[Op.gte]:operatingHoursFrom }},{operatingHoursTo:{[Op.lte]:operatingHoursFrom }},{validityFrom:{
                        [Op.gte]:validityFrom
                    }},{validityTo:{
                        [Op.lte]:validityFrom
                    }}]
                }
            })
            if(findIfDuplicateTariffFacilityExist){
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message:"This facilityId is already mapped to one tariff. Please deactivate the status for the given facility Id"
                })
            }
            updateDataForTariff.facilityId = facilityId
        }
        if(operatingHoursFrom!=findTariffById.operatingHoursFrom){
            updateDataForTariff.operatingHoursFrom = operatingHoursFrom
        }
        if(operatingHoursTo!=findTariffById.operatingHoursTo){
            updateDataForTariff.operatingHoursTo = operatingHoursTo

        }
        if(dayWeek.sun!=findTariffById.sun){
            updateDataForTariff.sun = sun 
        }
        if(dayWeek.mon!=findTariffById.mon){
            updateDataForTariff.mon = mon
        }
        if(dayWeek.tue!=findTariffById.tue){
            updateDataForTariff.tue = tue
        }
        if(dayWeek.wed!=findTariffById.wed){
            updateDataForTariff.wed = wed
        }
        if(dayWeek.thu!=findTariffById.thu){
            updateDataForTariff.thu = thu
        }
        if(dayWeek.fri!=findTariffById.fri){
            updateDataForTariff.fri = fri
        }
        if(dayWeek.sat!=findTariffById.sat){
            updateDataForTariff.sat = sat
        }
        if(amount!=findTariffById.amount){
            updateDataForTariff.amount = amount
        }
        if(statusId!=findTariffById.statusId){
            updateDataForTariff.statusId = statusId
        }
        if(validityFrom!=findTariffById.validityFrom){
            let findIfDuplicateTariffFacilityExist = await facilityTariff.findOne({
                where:{
                    [Op.and]:[{statusId:1},{facilityId:facilityId},{operatingHoursFrom:{[Op.gte]:operatingHoursFrom }},{operatingHoursTo:{[Op.lte]:operatingHoursFrom }},{validityFrom:{
                        [Op.gte]:validityFrom
                    }},{validityTo:{
                        [Op.lte]:validityFrom
                    }}]
                }
            })
            if(findIfDuplicateTariffFacilityExist){
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message:"This facilityId is already mapped to one tariff. Please deactivate the status for the given facility Id"
                })
            }
            updateDataForTariff.validityFrom =validityFrom
        }
        if(validityTo!= findTariffById.validityTo){
            updateDataForTariff.validityTo = validityTo
        }
        let [updateTariffCount, updateTariffData] = await facilityTariff.update(updateDataForTariff,{
            where:{
                tariffMasterId:tariffId
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
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
    })
}
}

let viewTariff = async (req,res)=>{
    try {
        let findViewTariff = await facilityTariff.findAll();
        return res.status(statusCode.SUCCESS.code).json({message:"All Tariff Data", tariffData:findViewTariff})
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}

module.exports= {
    createTariff,
    getTariffById,
    updateTariff,
    viewTariff
}