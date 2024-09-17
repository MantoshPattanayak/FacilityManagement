const cron = require('node-cron')
const db = require('../models')
const staffAllocation = db.facilityStaffAllocation
const staffAttendance = db.facilityStaffAttendance
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const Sequelize = db.Sequelize;
const logger = require('../logger/index.logger')
let users = db.usermaster
const path = require('path')
const sendEmail = require('../utils/generateEmail')
let {encrypt} = require('../middlewares/encryption.middlewares')
let {decrypt} = require('../middlewares/decryption.middlewares')

const cronSchedule = '* 10 * * * ' // At every 10 am

let checkTheAttendance = async ()=>{
    try {
        console.log('2334343')
        let todayDate = new Date();
        let statusId = 1;
        let findOutTheAllocatedStaffData = await sequelize.query(`select facilityStaffAllocationId , userId, allocationStartDate, allocationEndDate
            from amabhoomi.facilitystaffallocations where statusId = ? and allocationStartDate <= ? and allocationEndDate >= ? `,{
                replacements:[statusId, todayDate, todayDate],
                type:QueryTypes.SELECT
            })
        console.log('all Data',findOutTheAllocatedStaffData)
     
        
        if(findOutTheAllocatedStaffData.length > 0){
          for(let eachAllocatedStaff of findOutTheAllocatedStaffData){
            console.log('eachAllocatedStaff', eachAllocatedStaff)
            let findIfTheStaffPresent = await sequelize.query(`
                select sf.userId, sf.attendanceDate, sf.checkInTime, sf.checkOutTime, sf.statusId
                from  amabhoomi.facilitystaffattendances sf 
                where sf.statusId = ? and
                sf.attendanceDate = ? and sf.userId = ? `,{
                
                replacements:[statusId, todayDate, eachAllocatedStaff.userId],
                type:QueryTypes.SELECT
            })

            if (findIfTheStaffPresent.length == 0){
                console.log('if the staff present', findIfTheStaffPresent)
                let findOutTheUserDetails = await users.findOne({
                    where:{
                        userId: eachAllocatedStaff.userId,
                        statusId: statusId
                    }
                })

                if(findOutTheUserDetails){
                    let firstField = decrypt(findOutTheUserDetails.emailId);
              
                    message = `You have not submitted the attendance for today `;
              
                    try {
                      await sendEmail({
                        email: `${firstField}`,
                        subject: "Reminder of 'Check-In' ",
                        html: `<p>${message}</p>`
                      }
                      )
              
                    }
                    catch (err) {
                        logger.error(`An error occurred: ${err.message}`); // Log the error
                    }
                }
                
            }

          }
        }
         
        
    } catch (err) {
        logger.error(`An error occurred: ${err.message}`); // Log the error
    }
}
cron.schedule(cronSchedule,checkTheAttendance)
console.log('inside cron job')