const { Sequelize, DataTypes, QueryTypes } = require("sequelize");
const db = require("../config/db");
// console.log(db,'db credentials')

const sequelize = new Sequelize(db.DATABASE, db.USER, db.PASSWORD, {
  host: db.HOST,
  dialect: db.DIALECT,
  logging: false,
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db1 = {};
db1.Sequelize = Sequelize;
db1.sequelize = sequelize;
db1.DataTypes = DataTypes;
db1.QueryTypes = QueryTypes;

db1.amenitiesmaster = require("./amenitiesmaster.models")(sequelize, DataTypes);
db1.amenityfacilities = require("./amenityfacilities.models")(
  sequelize,
  DataTypes
);
db1.authsessions = require("./authsessions.models")(sequelize, DataTypes);
db1.bookinghistory = require("./bookinghistory.models")(sequelize, DataTypes);
db1.cart = require("./cart.models")(sequelize, DataTypes);
db1.facilities = require("./facilities.models")(sequelize, DataTypes);
db1.facilitytype = require("./facilitytype.models")(sequelize, DataTypes);
db1.inventorymaster = require("./inventorymaster.models")(sequelize, DataTypes);
db1.inventoryfacilities = require("./inventoryfacilities.models")(
  sequelize,
  DataTypes
);
db1.payment = require("./payment.models")(sequelize, DataTypes);
db1.refund = require("./refund.models")(sequelize, DataTypes);
db1.paymentItems = require("./paymentItems.models")(sequelize,DataTypes)

db1.resourcemaster = require("./resourcemaster.models")(sequelize, DataTypes);
db1.rolemaster = require("./rolemaster.models")(sequelize, DataTypes);
db1.roleresource = require("./roleresource.models")(sequelize, DataTypes);
db1.servicefacilities = require("./servicefacilities.models")(
  sequelize,
  DataTypes
);
db1.services = require("./services.models")(sequelize, DataTypes);
db1.statusmaster = require("./statusmaster.models")(sequelize, DataTypes);
db1.transaction = require("./transactions.models")(sequelize, DataTypes);
db1.transactiondetails = require("./transactiondetails.models")(
  sequelize,
  DataTypes
);
db1.usermaster = require("./usermaster.models")(sequelize, DataTypes);
db1.userresource = require("./userresource.models")(sequelize, DataTypes);
db1.gendermaster = require("./gendermaster.models")(sequelize, DataTypes);
db1.file = require("./file.models")(sequelize, DataTypes);
db1.fileattachment = require("./fileattachment.models")(sequelize, DataTypes);
db1.bookmarks = require("./userbookmarks.models")(sequelize, DataTypes);
db1.hosteventdetails = require("./hosteventdetails.models")(
  sequelize,
  DataTypes
);
db1.hosteventbookings = require("./hosteventbooking.models")(
  sequelize,
  DataTypes
);
db1.facilitybookings = require("./facilitybookings.models")(
  sequelize,
  DataTypes
);
db1.userbookingactivities = require("./userbookingactivities.models")(
  sequelize,
  DataTypes
);
db1.useractivitymasters = require("./useractivitymaster.models")(
  sequelize,
  DataTypes
);
db1.device = require("./device.models")(sequelize, DataTypes);
db1.otpDetails = require("./otpverification.models")(sequelize, DataTypes);
db1.languageresources = require("./languageresources.models")(
  sequelize,
  DataTypes
);
db1.faq = require("./frequentlyaskquestion.models")(sequelize, DataTypes);

db1.cart = require('./cart.models')(sequelize,DataTypes);
db1.cartItem = require('./cartitems.models')(sequelize,DataTypes)
// event bookings table
db1.eventBookings = require('./eventbookings.models')(sequelize,DataTypes)
//eventactivities - event masters
db1.eventActivities = require('./eventactivities.models')(sequelize, DataTypes)
db1.eventCategoryMaster = require('./eventcategorymasters.models')(sequelize,DataTypes)
// userActivityPreference

db1.userActivityPreference = require('./useractivitypreferences.models')(sequelize,DataTypes)
// grievance masters and details
db1.grievancemasters = require('./grievancemasters.models')(sequelize, DataTypes)
db1.grievanceDetails = require('./grievancedetails.models')(sequelize, DataTypes)
// ownership details
db1.ownershipDetails = require('./ownershipdetails.models')(sequelize, DataTypes)
// notification table
db1.publicnotifications = require('./publicnotifications.models')(sequelize, DataTypes)

db1.clicklog = require('./clicklog.models')(sequelize,DataTypes)
//facility activities
db1.facilityactivities = require('./facilityactivities.models')(sequelize, DataTypes)
// facilityEvents
db1.facilityEvents = require('./facilityEvents.models')(sequelize, DataTypes)
// facility tariff
db1.facilitytariff = require('./facilitytariff.models')(sequelize,DataTypes)
//frequentlyaskquestion
db1.faq = require('./frequentlyaskquestion.models')(sequelize,DataTypes)
//feedback
db1.feedback = require('./feedback.model')(sequelize, DataTypes)
//promotion
db1.promotions = require('./promotion.model')(sequelize, DataTypes)
db1.facilitiesderived = require(`./facilitiesderived.models`)(sequelize, DataTypes)
// add facility tariff master and facility tariff type
db1.tariffmaster = require('./facilitytariffmaster.models')(sequelize,DataTypes)
db1.tarifftype = require('./tariffType.models')(sequelize,DataTypes)
// add department models here
db1.departmentmasters = require('./departmentmasters.models')(sequelize, DataTypes)
db1.grievancecategories = require('./grievancecategories.models')(sequelize, DataTypes)
// bank details table 
db1.bankdetails = require('./bankdetail.models')(sequelize,DataTypes)
// user departments linking table
db1.userdepartments = require('./userdepartment.models')(sequelize, DataTypes)
db1.contactrequests = require('./contactus.models')(sequelize,DataTypes)
// partner with us
db1.partnerwithus = require('./partner.models')(sequelize,DataTypes)
// advertisement details start
db1.advertisementTariff = require('./advertisementtariffmaster.models')(sequelize,DataTypes)
db1.advertisementDetails = require('./advertisementdetails.models')(sequelize,DataTypes)
db1.advertisementMasters = require('./advertisementtype.models')(sequelize,DataTypes)
db1.galleryDetails = require("./gallerydetails.models")(sequelize, DataTypes)
db1.facilityStaffAllocation = require('./facilitystaffallocation.models')(sequelize, DataTypes)
db1.facilityStaffAttendance = require("./facilitystaffattendances.models")(sequelize, DataTypes)
// advertisement details end
// end partner with us
// join operations start
db1.facilities.hasMany(db1.facilitybookings,{foreignKey:"facilityId"})
db1.facilitybookings.belongsTo(db1.facilities,{foreignKey:'facilityId'})

db1.facilities.hasMany(db1.facilityactivities,{foreignKey:"facilityId"})
db1.facilityactivities.belongsTo(db1.facilities,{foreignKey:"facilityId"})

db1.useractivitymasters.hasMany(db1.facilityactivities,{foreignKey:"activityId"})
db1.facilityactivities.belongsTo(db1.useractivitymasters,{foreignKey:"activityId"})

db1.facilities.hasMany(db1.facilitytariff,{foreignKey:"facilityId"})
db1.facilitytariff.belongsTo(db1.facilities,{foreignKey:"facilityId"})

db1.eventCategoryMaster.hasMany(db1.facilityEvents,{foreignKey:"eventCategoryId"})
db1.facilityEvents.belongsTo(db1.eventCategoryMaster,{foreignKey:"eventCategoryId",as:'activityData' })

db1.useractivitymasters.hasMany(db1.facilityactivities,{ foreignKey: 'activityId', // This is the foreign key in db1.facilityactivities that references useractivitymasters
  sourceKey: 'userActivityId'}) // This is the source key in db1.useractivitymasters
db1.facilityactivities.belongsTo(db1.useractivitymasters,{foreignKey: 'activityId', // This is the foreign key in db1.facilityactivities that references useractivitymasters
  targetKey: 'userActivityId',
  as:'activityData' // This is the target key in db1.useractivitymasters
  })

db1.tariffmaster.hasMany(db1.facilitytariff,{foreignKey:'tariffMasterId'});
db1.facilitytariff.belongsTo(db1.tariffmaster,{foreignKey:'tariffMasterId'})

// for facilityRegistration details fetch

db1.facilities.hasMany(db1.amenityfacilities,{foreignKey:'facilityId'});
db1.amenityfacilities.belongsTo(db1.facilities,{foreignKey:'facilityId'})



db1.facilities.hasMany(db1.facilityEvents,{foreignKey:'facilityId'});
db1.facilityEvents.belongsTo(db1.facilities,{foreignKey:'facilityId'})


db1.facilities.hasMany(db1.servicefacilities,{foreignKey:'facilityId'});
db1.servicefacilities.belongsTo(db1.facilities,{foreignKey:'facilityId'})

db1.facilities.hasMany(db1.inventoryfacilities,{foreignKey:'facilityId'});
db1.inventoryfacilities.belongsTo(db1.facilities,{foreignKey:'facilityId'})

db1.ownershipDetails.hasMany(db1.facilities,{foreignKey:'ownershipDetailId'});
db1.facilities.belongsTo(db1.ownershipDetails,{foreignKey:'ownershipDetailId'})


// db1.facilities.hasMany(db1.fileattachment,{foreignKey:'entityId',
//   targetKey:'facilityId'
// })
// db1.fileattachment.hasMany(db1.facilities,{foreignKey:'entityId',
//   sourceKey:'facilityId'
// })


db1.inventorymaster.hasMany(db1.inventoryfacilities,{foreignKey:'equipmentId'})
db1.inventoryfacilities.hasMany(db1.inventorymaster,{foreignKey:'equipmentId'})

// join operations end


db1.facilities.hasMany(db1.eventActivities,{foreignKey:'facilityId'})
db1.eventActivities.belongsTo(db1.facilities,{foreignKey:'facilityId'})




db1.hosteventbookings.sync({
  alter:true,
});

module.exports = db1;
