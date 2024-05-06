const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const hosteventdetails = db.hosteventdetails;
const Sequelize = db.Sequelize;

const createHosteventdetails = async (req, res) => {
  try {
    let createHosteventdetails;
    const {
      eventId,
      firstName,
      lastName,
      organisationPanCardNumber,
      emailId,
      phoneNo,
      publicUserId,
      privateUserId,
      organisationName,
      category,
      organisationAddress,
      eventDate,
      eventStartDate,
      eventEndDate,
      Description,
      status,
    } = req.body;
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
      Description: Description,
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
