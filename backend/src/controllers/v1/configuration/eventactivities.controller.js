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
      ea.facilityMasterId, 
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
      ea.remark,
      ea.additionalDetails
      FROM 
      amabhoomi.eventactivites ea 
      INNER JOIN 
      amabhoomi.statusmasters sm ON sm.statusId = ea.statusId 
      ORDER BY 
      ea.facilityMasterId DESC
      `);

    console.log(showAllEventactivities, "all Eventactivities");
    let givenReq = req.body.givenReq ? req.body.givenReq : null;
    if (givenReq) {
      showAllEventactivities = showAllEventactivities.filter(
        (EventactivitiesData) =>
          EventactivitiesData.facilityMasterId.includes(givenReq) ||
          EventactivitiesData.name.toLowerCase().includes(givenReq)
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
module.exports = {
  viewEventactivities,
};