

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
let { Op } = require('sequelize')
let faciltyActivity = db.facilityactivities;
let facilityEvents = db.facilityEvents;
let useractivitymaster = db.useractivitymasters
let eventcategorymaster = db.eventCategoryMaster
// create tariff api
let createTariff = async (req, res) => {
    let transaction
    try {

        let createdDt = new Date();
        let updatedDt = new Date();
        let userId = req.user.userId
        let statusId = 1;
        let { facilityTariffData } = req.body
        let tariffCreationData;
        console.log("tariff Create data", facilityTariffData)
        // let {facilityId, operatingHoursFrom, operatingHoursTo, dayWeek, amount, validityFrom, validityTo }= req.body
        transaction = await sequelize.transaction();

        if (facilityTariffData.length == 0 || facilityTariffData.some((tariffData) => { !tariffData.facilityId || !tariffData.operatingHoursFrom || !tariffData.operatingHoursTo || !tariffData.dayWeek || !tariffData.tariffTypeId || !tariffData.entityId })) {

            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "Please provide all required fields"
            })
        }
        let tariffMasterCreationData;
        console.log('each tariff object line 38')

        for (let eachTariffObject of facilityTariffData) {
            // console.log('each tariff object', eachTariffObject)


            let findOutIfTheTariffAlreadyPresentOrNot = await tariffmaster.findOne({
                where: { [Op.and]: [{ facilityId: eachTariffObject.facilityId }, { entityId: eachTariffObject.entityId }, { tariffTypeId: eachTariffObject.tariffTypeId }, { statusId: statusId }] },
                transaction
            })
            console.log('find out if the tariff', findOutIfTheTariffAlreadyPresentOrNot)
            let tariffMasterQuery // for inserting the data to tariff masters
            if (!findOutIfTheTariffAlreadyPresentOrNot) {
                tariffMasterCreationData = {
                    facilityId: eachTariffObject.facilityId,
                    entityId: eachTariffObject.entityId,
                    tariffTypeId: eachTariffObject.tariffTypeId,
                    statusId: statusId,
                    createdBy: userId,
                    createdDt: createdDt,
                    updatedBy: userId,
                    updatedDt: updatedDt
                }

                tariffMasterQuery = await tariffmaster.create(tariffMasterCreationData, { transaction, returning: true })
                console.log('tariff master query', tariffMasterQuery)
            }
            else {
                tariffMasterQuery = {};
                tariffMasterQuery.tariffMasterId = findOutIfTheTariffAlreadyPresentOrNot.tariffMasterId;
            }

            console.log('hello 67 line')
            tariffCreationData = {
                facilityId: eachTariffObject.facilityId,
                tariffMasterId: tariffMasterQuery.tariffMasterId,
                operatingHoursFrom: eachTariffObject.operatingHoursFrom,
                operatingHoursTo: eachTariffObject.operatingHoursTo,
                sun: eachTariffObject.dayWeek.sun,
                mon: eachTariffObject.dayWeek.mon,
                tue: eachTariffObject.dayWeek.tue,
                wed: eachTariffObject.dayWeek.wed,
                thu: eachTariffObject.dayWeek.thu,
                fri: eachTariffObject.dayWeek.fri,
                sat: eachTariffObject.dayWeek.sat,
                createdBy: userId,
                createdDt: new Date(),
                updatedBy: userId,
                updatedDt: new Date(),
                statusId: statusId
            }
            console.log('hello 88 line', tariffCreationData)

            let findIfTheFacilityId = await facilityTariff.findOne({
                where: {
                    [Op.and]: [
                        {
                            statusId: statusId
                        },
                        {
                            tariffMasterId: tariffMasterQuery.tariffMasterId
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
                }, transaction
            });


            console.log(findIfTheFacilityId, 'findif the facilityId')

            if (findIfTheFacilityId) {
                await transaction.rollback();
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: `This tariff data is already present for operating hours ${eachTariffObject.operatingHoursFrom},`
                })
            }

            let createTariffData = await facilityTariff.create(tariffCreationData, { transaction, returning: true })

            if (!createTariffData) {
                await transaction.rollback();
                return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:`failed to create the tariff for operating hours from ${operatingHoursFrom}`} )

            }

        }
        await transaction.commit(); // If everything goes well, will do the commit here

        return res.status(statusCode.SUCCESS.code).json({
            message: "This data is successfully inserted"
        })




    } catch (err) {
        if (transaction) await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
        })
    }
}

let getTariffById = async (req, res) => {
    try {
        // console.log('1', req.body)
        let { facilityId, entityId, tariffTypeId } = req.body
        let statusId = 1;
        console.log({ facilityId, entityId, tariffTypeId });

        let findTariffById = await tariffmaster.findOne({
            where: {
                [Op.and]: [{ entityId: entityId }, { statusId: statusId }, { facilityId: facilityId }, { tariffTypeId: tariffTypeId }]
            },
            include: [{
                model: facilityTariff,
                required: true,
                where: {
                    statusId: statusId
                }
            }]
        })
        console.log("findTariffById", findTariffById);
        
        if (findTariffById) {
            return res.status(statusCode.SUCCESS.code).json({
                message: "Here is the tariff Data",
                tariffData: findTariffById
            })
        }
        return res.status(statusCode.BAD_REQUEST.code).json({
            message: "Invalid Request"
        })
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
        })
    }
}


let updateTariff = async (req, res) => {
    let transaction;
    try {
        let userId = req.user.userId;
        transaction = await sequelize.transaction();
        let { facilityTariffData } = req.body;
        console.log('facilityTariffData Update', req.body);
        let statusId = 1;
        let updateDataForTariff = {};

        if (facilityTariffData.length === 0 || facilityTariffData.some((tariffData) => !tariffData.facilityId || !tariffData.operatingHoursFrom || !tariffData.operatingHoursTo || !tariffData.dayWeek || !tariffData.statusId || !tariffData.tariffMasterId || !tariffData.tariffDetailId)) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "Please provide all required fields"
            });
        }

        for (let eachTariffObject of facilityTariffData) {
            let findFacilityTariffMaster = await tariffmaster.findOne({
                where: {
                    tariffMasterId: eachTariffObject.tariffMasterId
                },
                transaction
            })
            let findTariffById = await facilityTariff.findOne({
                where: {
                    [Op.and]: [{ tariffDetailId: eachTariffObject.tariffDetailId }, { statusId: statusId }]
                },
                transaction
            });

            if (!findTariffById) {
                await transaction.rollback();
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: `Tariff detail id ${eachTariffObject.tariffDetailId} not found or inactive`
                });
            }

            if (eachTariffObject.operatingHoursFrom !== findTariffById.operatingHoursFrom) {
                let findIfDuplicateTariffFacilityExist = await facilityTariff.findOne({
                    where: {
                        [Op.and]: [
                            { statusId: statusId },
                            { tariffMasterId: eachTariffObject.tariffMasterId },
                            { facilityId: eachTariffObject.facilityId },
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
                    },
                    transaction
                });

                if (findIfDuplicateTariffFacilityExist) {
                    await transaction.rollback();
                    return res.status(statusCode.BAD_REQUEST.code).json({
                        message: `Tariff detail id ${eachTariffObject.tariffDetailId} is already mapped to another tariff`
                    });
                }

                updateDataForTariff.operatingHoursFrom = eachTariffObject.operatingHoursFrom;
            }

            if (eachTariffObject.operatingHoursTo !== findTariffById.operatingHoursTo) {
                updateDataForTariff.operatingHoursTo = eachTariffObject.operatingHoursTo;
            }

            if (eachTariffObject.dayWeek.sun !== findTariffById.sun) {
                updateDataForTariff.sun = eachTariffObject.dayWeek.sun;
            }
            if (eachTariffObject.dayWeek.mon !== findTariffById.mon) {
                updateDataForTariff.mon = eachTariffObject.dayWeek.mon;
            }
            if (eachTariffObject.dayWeek.tue !== findTariffById.tue) {
                updateDataForTariff.tue = eachTariffObject.dayWeek.tue;
            }
            if (eachTariffObject.dayWeek.wed !== findTariffById.wed) {
                updateDataForTariff.wed = eachTariffObject.dayWeek.wed;
            }
            if (eachTariffObject.dayWeek.thu !== findTariffById.thu) {
                updateDataForTariff.thu = eachTariffObject.dayWeek.thu;
            }
            if (eachTariffObject.dayWeek.fri !== findTariffById.fri) {
                updateDataForTariff.fri = eachTariffObject.dayWeek.fri;
            }
            if (eachTariffObject.dayWeek.sat !== findTariffById.sat) {
                updateDataForTariff.sat = eachTariffObject.dayWeek.sat;
            }
            if (eachTariffObject.statusId !== statusId) {
                let [inactiveTheTariffStatus] = await tariffmaster.update({
                    statusId: eachTariffObject.statusId,
                    updatedBy: userId,
                    updatedDt: new Date()
                }, {
                    where: {
                        tariffMasterId: eachTariffObject.tariffMasterId
                    },
                    transaction
                });
                console.log('inactive tariff master', inactiveTheTariffStatus)
                let [inactiveTheFacilityTariffStatus] = await facilityTariff.update({
                    statusId: eachTariffObject.statusId,
                    updatedBy: userId,
                    updatedDt: new Date()
                }, {
                    where: {
                        tariffDetailId: eachTariffObject.tariffDetailId
                    },
                    transaction
                });
                console.log('inactive tariff details', inactiveTheFacilityTariffStatus)


                if (inactiveTheFacilityTariffStatus === 0 || inactiveTheTariffStatus === 0 && findFacilityTariffMaster.statusId === 1) {
                    await transaction.rollback();
                    return res.status(statusCode.BAD_REQUEST.code).json({
                        message: `Failed to update status for tariff detail id ${eachTariffObject.tariffDetailId}`
                    });
                }
            }

            if (Object.keys(updateDataForTariff).length > 0) {
                updateDataForTariff.updatedBy = userId;
                updateDataForTariff.updatedDt = new Date();

                let [updateTariffCount, updateTariffData] = await facilityTariff.update(updateDataForTariff, {
                    where: {
                        tariffDetailId: eachTariffObject.tariffDetailId
                    },
                    transaction
                });

                if (updateTariffCount === 0) {
                    await transaction.rollback();
                    return res.status(statusCode.BAD_REQUEST.code).json({
                        message: `Failed to update tariff details for tariff Id ${eachTariffObject.tariffDetailId}`
                    });
                }
            }
        }

        await transaction.commit();
        return res.status(statusCode.SUCCESS.code).json({
            message: `Data updated successfully`
        });

    } catch (err) {
        if (transaction) await transaction.rollback();

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
        });
    }
};


let inActiveEachTariffData = async (req, res) => {
    try {
        let { tariffDetailId, statusId } = req.body;
        console.log("here Response ", req.body)

        let [inActiveTheStatus] = await facilityTariff.update({
            statusId: statusId
        }, {
            where: {
                tariffDetailId: tariffDetailId
            }
        }
        )

        if (inActiveTheStatus > 0) {
            return res.status(statusCode.SUCCESS.code).json({
                message: `Data deactivated successfully`
            })
        }
        return res.status(statusCode.BAD_REQUEST.code).json({
            message: `Data is not updated`
        })
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
        })
    }
}

let viewTariff = async (req, res) => {
    try {
        let limit = req.body.page_size ? req.body.page_size : 500;
        let page = req.body.page_number ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
        let givenReq = req.body.givenReq ? req.body.givenReq.toString().toLowerCase() : null;
        let statusId = 1;
        // let findViewTariff
        let wholeFacilityData = [];
        // if(givenReq){
        //      findViewTariff = await facilities.findAll({
        //         where:{
        //            [Op.and]: [{statusId:statusId},{facilityTypeId:givenReq}]
        //         }
        //     });
        // }
        // else{
        //     findViewTariff = await facilities.findAll({
        //         where:{
        //             statusId:statusId
        //         },
        //         include:[
        //             {
        //                 model:
        //             }
        //         ]
        //     });
        // }

        // findViewTariff = await sequelize.query(`
        // select query.* from
        // (
        //     SELECT f.facilityName, f.facilityId, t2.tariffTypeId, t2.name as tariffType,f.facilityTypeId,
        //         uam.userActivityId AS entityId, uam.userActivityName AS activitiesEventName,
        //         CASE
        //         WHEN EXISTS (SELECT 1 FROM tarifftypes tt
        //                 JOIN tariffmasters tm ON tm.tariffTypeId = tt.tariffTypeId
        //                 WHERE tt.code = 'ACTIVITIES' AND tm.facilityId = f.facilityId
        //             ) THEN 1
        //             ELSE 0
        //         END AS tariffCheck
        //     FROM facilities f
        //     LEFT JOIN
        //         facilityactivities fa ON f.facilityId = fa.facilityId
        //     LEFT JOIN
        //         useractivitymasters uam ON fa.activityId = uam.userActivityId
        //     left join tariffmasters t on t.facilityId = f.facilityId
        //     left join tarifftypes t2 on t2.tariffTypeId = t.tariffTypeId
        //     WHERE
        //         fa.id IS NOT null
        //     group by f.facilityname, f.facilityId, t2.tariffTypeId,f.facilityTypeId,uam.userActivityId,uam.userActivityName,tariffCheck
        //     union all
        //     SELECT
        //         f.facilityname AS facilityName,
        //         f.facilityId,
        //         t2.tariffTypeId,
        //         t2.name as tariffType,
        //         f.facilityTypeId,
        //         ecm.eventCategoryId as entityId,
        //         ecm.eventCategoryName AS activitiesEventName,
        //         CASE
        //             WHEN EXISTS (
        //                 SELECT 1
        //                 FROM tarifftypes tt
        //                 JOIN tariffmasters tm ON tm.tariffTypeId = tt.tariffTypeId
        //                 WHERE tt.code = 'HOST_EVENT'
        //                 AND tm.facilityId = f.facilityId
        //             ) THEN 1
        //             ELSE 0
        //         END AS tariffCheck
        //     FROM
        //         facilities f
        //     LEFT JOIN
        //         facilityevents fe ON f.facilityId = fe.facilityId
        //     LEFT JOIN
        //         eventcategorymasters ecm ON fe.eventCategoryId = ecm.eventCategoryId
        //     left join tariffmasters t on t.facilityId = f.facilityId
        //     left join tarifftypes t2 on t2.tariffTypeId = t.tariffTypeId
        //     WHERE
        //         fe.facilityEventId IS NOT null
        //     group by f.facilityname, f.facilityId, t2.tariffTypeId,f.facilityTypeId,ecm.eventCategoryId,ecm.eventCategoryName,tariffCheck
        // ) query
        // `, {
        //     type: QueryTypes.SELECT
        // })
        let fetchTheFacilityNameWRTTariffType = await sequelize.query(` select f.facilityname,t.tariffTypeId, t.entityId  from facilities f 
                inner join tariffmasters t       
                on f.facilityId = t.facilityId where t.statusId = ? 
                            `,{
            replacements:[statusId],
            type:QueryTypes.SELECT
        })
        let findTheActivityDetails = await sequelize.query(` select u.userActivityName as tariffType,fa.facilityname, u.userActivityId as activityId, f.facilityId, f.facilityTypeId as tariffTypeId  from amabhoomi.facilityactivities f inner 
                            join useractivitymasters u on u.userActivityId = f.activityId
                            inner join facilities fa on fa.facilityId = f.facilityId
                            where f.statusId = ?  and u.statusId = ? `,{
                                type:QueryTypes.SELECT,
                                replacements:[statusId,statusId]
                            })

        let findTheEventDetails = await sequelize.query(` select e2.eventCategoryId as activityId ,fa.facilityname, e2.eventCategoryName as tariffType,e.facilityId  from amabhoomi.eventactivities e 
                            inner join amabhoomi.eventcategorymasters e2 
                            on e2.eventCategoryId = e.eventCategoryId 
                            inner join facilities fa on fa.facilityId = e.facilityId
                            where e.statusId = ? and e2.statusId = ?`,{
                                type:QueryTypes.SELECT,
                                replacements:[statusId,statusId] 
                            })
        
        if(findTheEventDetails.length>0){
            for(let i of findTheEventDetails){
                i.tariffTypeId = 3
            }
        }
        wholeFacilityData = findTheActivityDetails.concat(findTheEventDetails)

        if(wholeFacilityData.length>0){
            for(let i of wholeFacilityData){
                i.tariffCheck = 0
            }
        }
        // console.log('fetchTheFacilityNameWRTTariffType', fetchTheFacilityNameWRTTariffType)
        if(fetchTheFacilityNameWRTTariffType.length > 0){
           wholeFacilityData = wholeFacilityData.map(eachData=>{
            let matchedItem = fetchTheFacilityNameWRTTariffType.find(eachItem=>eachData.tariffTypeId == eachItem.tariffTypeId)
            return matchedItem ? { ...eachData, tariffCheck: 1 } : eachData
           })
            
        }

     
        console.log(wholeFacilityData,'wholefacilityData')

        let paginatedTariff = wholeFacilityData.slice(offset, offset + limit);

        if(givenReq) {
            paginatedTariff = paginatedTariff.filter((data) => {
               if ( data.facilityname?.toLowerCase().includes(givenReq) 
                || data.tariffType?.toLowerCase().includes(givenReq))
                    return data; 
            });
        }

        return res.status(statusCode.SUCCESS.code).json({ message: "All Tariff Data", tariffData: wholeFacilityData })
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
        })
    }
}

let initialDataForTariffSelectionWRTCategory = async (req, res) => {
    try {
        let { facilityId, tariffTypeId } = req.body
        let statusId = 1;
        let findTheNameOfThoseActivities;
        let findTheNameOfThoseSports;
        let findTheNameOfThoseEvents;
        let findFacilityTypeIdFromFacilityTable

        let tariffTypeQuery = await tarifftype.findAll({ where: { statusId: statusId } })

        if (facilityId) {
            findFacilityTypeIdFromFacilityTable = await facilities.findOne({
                where: {
                    [Op.and]: [{ statusId: statusId }, { facilityId: facilityId }]
                }
            })
        }

        if (facilityId && tariffTypeId == 1) {
            findTheNameOfThoseActivities = await faciltyActivity.findAll({
                where: {
                    [Op.and]: [{ facilityTypeId: { [Op.ne]: 2 } }, { statusId: statusId }, { facilityId: facilityId }]
                },
                include: [{
                    model: useractivitymaster,
                    as: 'activityData',
                    attributes: [['userActivityId', 'activityId'], ['userActivityName', 'activityName']]

                    // Add any additional options for the included model here if needed
                }]

            })

            return res.status(statusCode.SUCCESS.code).json({
                message: "Initial Data for tariff",
                facilityData: findFacilityTypeIdFromFacilityTable,
                tariffTypeData: tariffTypeQuery,
                activityData: findTheNameOfThoseActivities
            })
        }
        if (findFacilityTypeIdFromFacilityTable?.facilityTypeId == 2 && facilityId && tariffTypeId == 2) {

            findTheNameOfThoseSports = await faciltyActivity.findAll({
                where: {
                    [Op.and]: [{ facilityTypeId: { [Op.eq]: 2 } }, { statusId: statusId }, { facilityId: facilityId }]
                },
                include: [
                    {
                        model: useractivitymaster,
                        as: 'activityDetails',

                        attributes: [['userActivityId', 'activityId'], ['userActivityName', 'activityName']]
                        // Add any additional options for the included model here if needed
                    }
                ]
            }
            )


            return res.status(statusCode.SUCCESS.code).json({
                message: "Initial Data for tariff",
                facilityData: findFacilityTypeIdFromFacilityTable,
                tariffTypeData: tariffTypeQuery,
                activityData: findTheNameOfThoseSports
            })
        }
        if (facilityId && tariffTypeId == 3) {

            findTheNameOfThoseEvents = await facilityEvents.findAll({
                where: {
                    [Op.and]: [{ statusId: statusId }, { facilityId: facilityId }]
                },
                include: [
                    {
                        model: eventcategorymaster,
                        as: 'activityData',
                        attributes: [['eventCategoryId', 'activityId'], // Rename eventCategoryId to activityId
                        ['eventCategoryName', 'activityName']] // Rename eventCategoryName to activityName]
                        // Add any additional options for the included model here if needed
                    }
                ]
            }
            )
            return res.status(statusCode.SUCCESS.code).json({
                message: "Initial Data for tariff",
                facilityData: findFacilityTypeIdFromFacilityTable,
                tariffTypeData: tariffTypeQuery,
                activityData: findTheNameOfThoseEvents
            })
        }
        return res.status(statusCode.SUCCESS.code).json({
            message: "Initial Data for tariff",
            facilityData: findFacilityTypeIdFromFacilityTable,
            tariffTypeData: tariffTypeQuery
        })


    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json(err.message)
    }
}


module.exports = {
    createTariff,
    getTariffById,
    updateTariff,
    viewTariff,
    initialDataForTariffSelectionWRTCategory,
    inActiveEachTariffData,

}