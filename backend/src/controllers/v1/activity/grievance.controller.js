const { sequelize, Sequelize } = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const db = require("../../../models");
const grievanceMasters = db.grievancemasters;
const statusMasters = db.statusmaster;
const feedbacks = db.feedback

// insert grievance - start
let addGrievance = async (req, res) => {

}
//insert grievance - end

// view grievance list - start
let viewGrievanceList = async (req, res) => {
    try{
        let limit = req.body.page_size ? req.body.page_size : 100;
        let page = req.body.page_number ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
        let givenReq = req.body.givenReq ? req.body.givenReq?.toLowerCase() : null;

        let fetchGrievanceQuery = await grievanceMasters.findAll({});
        let statusMasterData = await statusMasters.findAll({});

        console.log('givenReq', givenReq);

        fetchGrievanceQuery = fetchGrievanceQuery.map((grievance) => {
            const matchingStatus = statusMasterData.find(status => 
                status.dataValues.statusId == grievance.dataValues.statusId && 
                status.dataValues.parentStatusCode == 'GRIEVANCE_USER_STATUS'
            );
        
            if (matchingStatus) {
                grievance.dataValues.status = matchingStatus.dataValues.description;
            }
            return grievance;
        });

        let matchedData = fetchGrievanceQuery;

        if(givenReq){
            matchedData = matchedData.filter((grievanceData) => {
                // console.log('grievance data', grievanceData.details.toLowerCase().includes(givenReq));
                if(grievanceData.fullname?.toLowerCase().includes(givenReq) ||
                grievanceData.emailId?.toLowerCase().includes(givenReq) ||
                grievanceData.subject?.toLowerCase().includes(givenReq) ||
                grievanceData.details?.toLowerCase().includes(givenReq) ||
                grievanceData.status?.toLowerCase().includes(givenReq) ||
                (!isNaN(Number(givenReq)) && grievanceData.phoneNo?.includes(givenReq)))
                    return grievanceData
            })
        }

        let grievanceListData = matchedData.slice(offset, limit + offset);

        if(grievanceListData.length > 0){
            res.status(statusCode.SUCCESS.code).json({
                message: 'Grievance list',
                grievanceListData
            })
        }
        else{
            res.status(statusCode.NOTFOUND.code).json({
                message: 'No data found'
            })
        }
    }
    catch(error){
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}
// view grievance list - end

// view grievance details by id - start
let viewGrievanceById = async (req, res) => {
    try{
        let grievanceId = req.params.grievanceId;
        console.log('grievance id', grievanceId);

        let fetchGrievanceDetails = await grievanceMasters.findOne({
            where: {
                grievanceMasterId: grievanceId
            }
        })
        console.log(fetchGrievanceDetails);

        if(fetchGrievanceDetails) {
            res.status(statusCode.SUCCESS.code).json({
                message: "Grievance details",
                grievanceDetails: fetchGrievanceDetails
            })
        }
        else{
            res.status(statusCode.NOTFOUND.code).json({
                message: 'No data found.'
            })
        }
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}
// view grievance details by id - end

//create feedback -start
const createFeedback = async (req, res) => {
    try {
      let createFeedback;
      const {
       name,
       mobile,
       email,
       subject,
       feedback,
       isWhatsappNumber
      } = req.body;
      createFeedback = await feedbacks.create({
          name: name,
          mobile: mobile,
          email: email,
          subject: subject,
          feedback: feedback,
          isWhatsappNumber: isWhatsappNumber
        });
        if (createFeedback) {
          return res.status(statusCode.SUCCESS.code).json({
            message: "Feedback created successfully",
          });
        }
        return res.status(statusCode.BAD_REQUEST.code).json({
          message: "Feedback is not created",
        });
      
    } catch (error) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: error.message,
      });
    }
  };
//create feedback -end 

module.exports = {
    addGrievance,
    viewGrievanceList,
    viewGrievanceById,
    createFeedback
}