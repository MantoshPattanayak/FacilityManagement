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
    let location = req.body.location;
    let [showAllEventactivities] = await sequelize.query(`    
      SELECT 
      ea.eventId,
      ea.facilityId,
      f.facilityname,
      ea.eventName, 
      ea.eventCategoryId,
      ecm.eventCategoryName as eventCategory,
      ea.locationName, 
      ea.eventDate, 
      ea.eventStartTime,
      ea.eventEndTime,
      ea.descriptionOfEvent,
      ea.ticketSalesEnabled,
      ea.ticketPrice,
      ea.eventImagePath,
      ea.additionalFilePath,
      TIME(CONVERT_TZ(CURRENT_TIME(), @@session.time_zone, 'SYSTEM')) as dbTime,
      CASE
      	WHEN CONCAT(ea.eventDate, ' ', ea.eventStartTime) >= CONVERT_TZ(NOW(), @@session.time_zone, 'SYSTEM') 
        THEN 'ACTIVE'
      	ELSE 'CLOSED'
      END AS status,
      ea.additionalDetails
      FROM 
      amabhoomi.eventactivities ea 
      INNER JOIN 
      amabhoomi.statusmasters sm ON sm.statusId = ea.statusId
      LEFT JOIN
      amabhoomi.facilities f on ea.facilityId = f.facilityId
      left join
      amabhoomi.eventcategorymasters ecm on ea.eventCategoryId = ecm.eventCategoryId
      ORDER BY
      ea.eventDate desc
    `);

    // console.log(showAllEventactivities, "all Eventactivities");
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
      f.latitude,
      f.longitude,
      ea.eventName,
      ea.eventCategoryId,
      e.eventCategoryName as eventCategory, 
      ea.locationName, 
      ea.descriptionOfEvent,
      ea.ticketSalesEnabled,
      ea.ticketPrice,
      ea.eventImagePath,
      ea.additionalFilePath,
      ea.eventDate, 
      ea.eventStartTime,
      ea.eventEndTime,
      TIME(CONVERT_TZ(CURRENT_TIME(), @@session.time_zone, 'SYSTEM')) as dbTime,
      CASE
      	WHEN CONCAT(ea.eventDate, ' ', ea.eventStartTime) >= CONVERT_TZ(NOW(), @@session.time_zone, 'SYSTEM') THEN 'ACTIVE'
      	ELSE 'CLOSED'
      END AS status,
      ea.additionalDetails
      FROM 
        amabhoomi.eventactivities ea 
      INNER JOIN 
        amabhoomi.statusmasters sm ON sm.statusId = ea.statusId
      LEFT JOIN
        amabhoomi.facilities f ON ea.facilityId = f.facilityId
      left join 
      	amabhoomi.eventcategorymasters e on e.eventCategoryId = ea.eventCategoryId
      WHERE 
      ea.eventId = :eventId
    `,
      {
        replacements: { eventId: eventId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    eventActivity.amentities = ['Parking', 'Food Stalls', 'Drinking Water'];

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
