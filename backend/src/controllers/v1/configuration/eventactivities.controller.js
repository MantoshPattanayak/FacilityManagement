const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const eventactivites = db.eventActivities;
const Sequelize = db.Sequelize;
const logger = require('../../../logger/index.logger')

const viewEventactivities = async (req, res) => {
  try {
    let limit = req.body.page_size ? req.body.page_size : 50;
    let page = req.body.page_number ? req.body.page_number : 1;
    let offset = (page - 1) * limit;
    let { latitude, longitude, range, popular, free, paid, order, selectedFilter } = req.body;
    let givenReq = req.body.givenReq ? req.body.givenReq : null;
    // Default range is set to 20 if not provided
    range = range ? range : 20;
    order = order ? order : 'desc';
    console.log({latitude, longitude, range, popular, free, paid, order, selectedFilter});

    //fetch all events list
    let [showAllEventactivities] = await sequelize.query(`    
      SELECT 
      ea.eventId,
      ea.facilityId,
      f.facilityname,
      f.latitude, 
      f.longitude,
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
        WHEN ea.eventStartTime >= CONVERT_TZ(NOW(), @@session.time_zone, 'SYSTEM') 
        THEN 'ACTIVE'
        ELSE 'CLOSED'
      END AS status,
      ea.additionalDetails,
      f3.url as eventMainImage
      , h.hostBookingId
      FROM amabhoomi.eventactivities ea 
      inner join amabhoomi.statusmasters sm ON sm.statusId = ea.statusId
      inner JOIN amabhoomi.facilities f on ea.facilityId = f.facilityId
      inner join amabhoomi.eventcategorymasters ecm on ea.eventCategoryId = ecm.eventCategoryId
      inner join amabhoomi.fileattachments f2 on f2.entityId = ea.eventId and f2.entityType = 'events' and f2.filePurpose = 'Event Image'
      inner join amabhoomi.files f3 on f3.fileId = f2.fileId
      inner join amabhoomi.hosteventdetails hed on hed.eventId = ea.eventId
      inner join amabhoomi.hostbookings h on hed.hostId = h.hostId
      inner join amabhoomi.statusmasters s on s.statusId = h.statusId and s.parentStatusCode = "HOSTING_STATUS"
      where s.statusCode = 'APPROVED'
      ORDER by ea.eventDate ${order}
    `);

    // search input string
    if (givenReq) {
      showAllEventactivities = showAllEventactivities.filter(
        (EventactivitiesData) =>
          EventactivitiesData.facilityId.includes(givenReq) ||
          EventactivitiesData.eventName.toLowerCase().includes(givenReq) ||
          EventactivitiesData.eventCategory.toLowerCase().includes(givenReq) ||
          EventactivitiesData.locationName.toLowerCase().includes(givenReq)
      );
    }

    //if free option selected then show free event details only
    if(free) {
      showAllEventactivities = showAllEventactivities.filter(
        (EventactivitiesData) => 
          EventactivitiesData.ticketSalesEnabled.includes('0')
      )
    }

    //if paid option selected then paid free event details only
    if(paid) {
      showAllEventactivities = showAllEventactivities.filter(
        (EventactivitiesData) => 
          EventactivitiesData.ticketSalesEnabled.includes('1')
      )
    }

    //if popular option selected, then show popular events booked in recent date
    if(popular) {
      let popularFacilityQuery = await sequelize.query(`    
        SELECT 
        ea.eventId,
        ea.facilityId,
        f.facilityname,
        f.latitude, 
        f.longitude,
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
          WHEN ea.eventStartTime >= CONVERT_TZ(NOW(), @@session.time_zone, 'SYSTEM') 
          THEN 'ACTIVE'
          ELSE 'CLOSED'
        END AS status,
        ea.additionalDetails,
        f3.url as eventMainImage, h.statusId 
        ,s.statusCode as eventApprovalStatus
        FROM amabhoomi.eventactivities ea 
        inner join amabhoomi.statusmasters sm ON sm.statusId = ea.statusId
        inner JOIN amabhoomi.facilities f on ea.facilityId = f.facilityId
        inner join amabhoomi.eventcategorymasters ecm on ea.eventCategoryId = ecm.eventCategoryId
        left join amabhoomi.fileattachments f2 on f2.entityId = ea.eventId and f2.entityType = 'events' and f2.filePurpose = 'Event Image'
        left join amabhoomi.files f3 on f3.fileId = f2.fileId
        inner join amabhoomi.hosteventdetails hed on hed.eventId = ea.eventId
        inner join amabhoomi.hostbookings h on hed.hostId = h.hostId
        inner join amabhoomi.statusmasters s on s.statusId = h.statusId and s.parentStatusCode = "HOSTING_STATUS"
        where s.statusCode = 'APPROVED'
        ORDER by ea.eventDate ${order}
      `);
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
    logger.error(`An error occurred: ${err.message}`); // Log the error
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
        WHEN ea.eventStartTime >= CONVERT_TZ(NOW(), @@session.time_zone, 'SYSTEM') THEN 'ACTIVE'
        ELSE 'CLOSED'
      END AS status,
      ea.additionalDetails, group_concat(f3.url separator ';') as eventAdditionalImages
      FROM amabhoomi.eventactivities ea 
      INNER JOIN amabhoomi.statusmasters sm ON sm.statusId = ea.statusId
      inner join amabhoomi.facilities f ON ea.facilityId = f.facilityId
      inner join amabhoomi.eventcategorymasters e on e.eventCategoryId = ea.eventCategoryId
      left join amabhoomi.fileattachments f2 on f2.entityId = ea.eventId and f2.entityType = 'events' and f2.filePurpose = 'Event additional file'
      left join amabhoomi.files f3 on f3.fileId = f2.fileId
      WHERE ea.eventId = :eventId
      group by ea.eventId
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
    logger.error(`An error occurred: ${err.message}`); // Log the error
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: err.message,
    });
  }
};

module.exports = {
  viewEventactivities,
  viewEventactivitiesById,
};
