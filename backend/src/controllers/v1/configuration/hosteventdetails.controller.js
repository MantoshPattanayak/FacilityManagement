const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const hosteventdetails = db.hosteventdetails;
const Sequelize = db.Sequelize;
const bankDetails = db.bankDetail
const createHosteventdetails = async (req, res) => {
  try {
    let publicUserId =1;
    let role =1
    let privateUserId =1
    if(role){
       privateUserId=1;
      publicUserId= 2
    }
    let createHosteventdetails;
    let createBankDetails;
    const {
      eventId,
      firstName,
      lastName,
      organisationPanCardNumber,
      organisationName,
      organisationAddress,
      emailId,
      phoneNo,
      category,
      eventDate,
      eventStartDate,
      eventEndDate,
      description,
      status,
      accountType,
      beneficiaryName,
      bankName,
      bankIfsc,
      accountNumber,
      eventImage,
      additionalFile
    } = req.body;
console.log("here Reponse of Host event", req.body)
    createBankDetails = await bankDetails.create({
      beneficiaryName:beneficiaryName,
      accountNumber:accountNumber,
      accountType:accountType,
      bankName:bankName,
      bankIfscCode:bankIfsc
    })

    createHosteventdetails = await hosteventdetails.create({
      eventId: eventId,
      firstName: firstName,
      lastName: lastName,
      organisationPanCardNumber: organisationPanCardNumber,
      emailId: emailId,
      phoneNo: phoneNo,
      publicUserId: publicUserId,
      privateUserId: privateUserId,
      organisationName: organisationName,
      category: category,
      organisationAddress: organisationAddress,
      eventDate: eventDate,
      eventStartDate: eventStartDate,
      eventEndDate: eventEndDate,
      Description: description,
      statusId: status,
    });
    
    console.log(createHosteventdetails);
    if (createHosteventdetails) {
      return res.status(statusCode.SUCCESS.code).json({
        message: "Host Event created successfully",
      });
    }
    return res.status(statusCode.BAD_REQUEST.code).json({
      message: "Host Event is not created",
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message,
    });
  }
};
const bankService = async (req, res) => {
  try {
    let bankService = await sequelize.query(`
    SELECT
    id,
    bankName
    FROM 
    amabhoomi.bankservices
    `);

    let findEventCategory =
    await sequelize.query(`select eventCategoryId,eventName, eventType from
  amabhoomi.eventcategorymasters`);

    return res
      .status(statusCode.SUCCESS.code)
      .json({ message: "These are the dropdown data", bankServiceData: bankService[0], eventCategoryData:findEventCategory[0] });
  } catch (err) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};

const eventDropdownData = async (req, res) => {
  try {
    let findEventCategory =
      await sequelize.query(`select eventCategoryId,eventName, eventType from
    amabhoomi.eventcategorymasters`);

    return res
      .status(statusCode.SUCCESS.code)
      .json({ message: "Event Category data", data: findEventCategory[0] });
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};
module.exports = {
  createHosteventdetails,
  bankService,
  eventDropdownData,
};
