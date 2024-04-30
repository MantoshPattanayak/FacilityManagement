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
    try {
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
        }, 'before change');

        // Function to add hours to a time string
        function addHoursToTime(timeString, hoursToAdd) {
            // Parse the time string into hours and minutes
            const [hours, minutes] = timeString.split(':').map(Number);
            console.log({hours, minutes, hoursToAdd});

            // Add the hours
            let newHours = (hours + hoursToAdd) % 24;

            // Ensure newHours is in the range [0, 23]
            newHours = newHours < 0 ? newHours + 24 : newHours;

            // Format the result back into a time string
            const newTimeString = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            console.log(newTimeString);

            return newTimeString;
        }

        const endTime = addHoursToTime(startTime, Number(durationInHours) );

        console.log({
            facilityId,
            totalMembers,
            amount,
            activityPreference,
            otherActivities,
            bookingDate,
            startTime,
            endTime,
            durationInHours
        }, 'after change');

        let statusList = await statusmasters.findAll({ where: { parentStatusCode: 'PAYMENT_STATUS' } });

        // console.log(statusList[0].dataValues);

        let paidStatusCode = statusList.filter((status) => { return status.dataValues.statusCode == 'COMPLETED' })[0].dataValues.statusId;

        // console.log('paid', paidStatusCode);

        bookingTransaction();
        // res.status(200).json({message: 'Booking details submitted!'})
        
        async function bookingTransaction() {
            let transaction;
            try {
                transaction = await sequelize.transaction();

                const newParkBooking = await facilitybookings.create({
                    facilityId: facilityId,
                    totalMembers: totalMembers,
                    otherActivities: otherActivities,
                    bookingDate: bookingDate,
                    startDate: startTime,
                    endDate: endTime,
                    amount: amount,
                    statusId: 1,
                    paymentstatus: '',
                    createdBy: userId
                }, { transaction });

                console.log('newParkBooking', newParkBooking);

                for (let i = 0; i < activityPreference.length; i++) {
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
            catch (error) {
                if (transaction) await transaction.rollback();

                console.error('Error creating user park booking:', error);
                res.status(statusCode.BAD_REQUEST.code).json({
                    message: 'Park booking failed!',
                    data: []
                })
            }
        }
    }
    catch (error) {
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
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

module.exports = {
    parkBooking,
    parkBookingFormInitialData
}