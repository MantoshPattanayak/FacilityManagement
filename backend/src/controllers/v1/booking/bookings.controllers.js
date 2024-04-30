const db = require("../../../models/index");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const role = db.rolemaster;
const facilitybookings = db.facilitybookings;
const userbookingactivities = db.userbookingactivities;
const statusmasters = db.statusmaster;
const useractivitymasters = db.useractivitymasters;

let parkBooking = async (req, res) => {
    try{
        /**
         * @facilitytype park
         */
        let userId = req.user?.id || 1;
        let {
            facilityId,
            totalMembers,
            amount,
            activityPreference,
            otherActivities,
            bookingDate,
            startTime,
            durationInHours
        } = req.body;

        console.log({
            facilityId,
            totalMembers,
            amount,
            activityPreference,
            otherActivities,
            bookingDate,
            startTime,
            durationInHours
        });

        let endDate = new Date(startTime);
        endDate.setHours(endDate.getHours() + durationInHours);

        let statusList = await statusmasters.findAll({ where: { parentStatusCode: 'PAYMENT_STATUS' } });

        // console.log(statusList[0].dataValues);

        let paidStatusCode = statusList.filter((status) => {return status.dataValues.statusCode == 'COMPLETED'})[0].dataValues.statusId;

        // console.log('paid', paidStatusCode);
        
        bookingTransaction();

        async function bookingTransaction() {
            let transaction;
            try {
                transaction = await sequelize.transaction();

                const newParkBooking = await facilitybookings.create({
                    facilityId: facilityId,
                    totalMembers: totalMembers,
                    otherActivities: otherActivities,
                    bookingDate: bookingDate,
                    startDate: new Date(startTime),
                    endDate: endDate,
                    amount: amount,
                    statusId: 1,
                    paymentstatus: '',
                    createdBy: userId
                }, { transaction });
        
                // console.log('newParkBooking', newParkBooking);
                
                for(let i = 0; i < activityPreference.length; i++){
                    const newParkBookingActivityPreference = await userbookingactivities.create({
                        facilityBookingId: newParkBooking.dataValues.facilityBookingId,
                        userActivityId: activityPreference[i],
                        statusId: 1,
                        createdBy: userId
                    }, { transaction });
                }

                await transaction.commit();

                res.status(statusCode.SUCCESS.code).json({
                    message: 'Park booking done successfully',
                    data: newParkBooking
                })
            }
            catch(error) {
                if (transaction) await transaction.rollback();

                console.error('Error creating user park booking:', error);
                res.status(statusCode.BAD_REQUEST.code).json({
                    message: 'Park booking failed!',
                    data: []
                })
            }
        }
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let parkBookingFormInitialData = async (req, res) => {
    try {
        let userActivityMaster = await useractivitymasters.findAll();

        // let activity = ['Walking', 'Yoga', 'Open Gym', 'Jogging', 'Children Park'];

        // for(let i = 0; i < activity.length; i++){
        //     let user = await useractivitymasters.create({
        //         userActivityName: activity[i],
        //         statusId: 1,
        //         createdBy: 1
        //     })
        // }
        
        res.status(statusCode.SUCCESS.code).json({
            message: 'Park booking form initial data',
            data: userActivityMaster
        })
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

module.exports = {
    parkBooking,
    parkBookingFormInitialData
}