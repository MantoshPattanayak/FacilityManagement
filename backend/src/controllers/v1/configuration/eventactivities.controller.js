const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const eventactivites = db.eventactivities;
const Sequelize = db.Sequelize;
const viewEventactivities = async (req, res) => {
  try {
    let limit = req.body.page_size ? req.body.page_size : 50;
    let page = req.body.page_number ? req.body.page_number : 1;
    let offset = (page - 1) * limit;
    let [showAllEventactivities] = await sequelize.query(`    
      SELECT 
      ea.eventId,
      ea.facilityId,
      f.facilityname,
      ea.eventName, 
      ea.eventCategory, 
      ea.locationName, 
      ea.eventDate, 
      ea.eventStartTime,
      ea.eventEndTime,
      ea.descriptionOfEvent,
      ea.ticketSalesEnabled,
      ea.ticketPrice,
      ea.eventImagePath,
      ea.additionalFilesPath,
      sm.statusCode as status,
      ea.remarks,
      ea.additionalDetails
      FROM 
      amabhoomi.eventactivities ea 
      INNER JOIN 
      amabhoomi.statusmasters sm ON sm.statusId = ea.statusId
      left join
      amabhoomi.facilities f on ea.facilityId = f.facilityId
      ORDER BY 
      ea.eventDate DESC
    `);

    console.log(showAllEventactivities, "all Eventactivities");
    let givenReq = req.body.givenReq ? req.body.givenReq : null;
    if (givenReq) {
      showAllEventactivities = showAllEventactivities.filter(
        (EventactivitiesData) =>
          EventactivitiesData.facilityId.includes(givenReq) ||
          EventactivitiesData.eventName.toLowerCase().includes(givenReq) ||
          EventactivitiesData.eventCategory.toLowerCase().includes(givenReq) ||
          EventactivitiesData.locationName.toLowerCase().includes(givenReq)
      );
    }
    let paginatedshowAllEventactivities = showAllEventactivities.slice(
      offset,
      limit + offset
    );
    return res.status(statusCode.SUCCESS.code).json({
      message: "Show All Eventactivities",
      Eventactivities: paginatedshowAllEventactivities,
    });
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: err.message,
    });
  }
};
const viewEventactivitiesById = async (req, res) => {
  try {
    console.log('event data')
    console.log(req.params,'req params')
    let eventId = req.params.eventId ? req.params.eventId : null;
    if (!eventId) {
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: "eventId is required",
      });
    }

    let [eventActivity] = await sequelize.query(
      `SELECT 
      ea.eventId,
      ea.facilityId,
      f.facilityname,
      ea.eventName, 
      ea.eventCategory, 
      ea.locationName, 
      ea.eventDate, 
      ea.eventStartTime,
      ea.eventEndTime,
      ea.descriptionOfEvent,
      ea.ticketSalesEnabled,
      ea.ticketPrice,
      ea.eventImagePath,
      ea.additionalFilesPath,
      sm.statusCode as status,
      ea.remarks,
      ea.additionalDetails
      FROM 
      amabhoomi.eventactivities ea 
      INNER JOIN 
      amabhoomi.statusmasters sm ON sm.statusId = ea.statusId
      LEFT JOIN
      amabhoomi.facilities f ON ea.facilityId = f.facilityId
      WHERE 
      ea.eventId = :eventId
    `,
      {
        replacements: { eventId: eventId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!eventActivity) {
      return res.status(statusCode.NOTFOUND.code).json({
        message: "Event activity not found",
      });
    }

    return res.status(statusCode.SUCCESS.code).json({
      message: "Event activity details",
      eventActivityDetails: eventActivity,
    });
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: err.message,
    });
  }
};

module.exports = {
  viewEventactivities,
  viewEventactivitiesById,
};
