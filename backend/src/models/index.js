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
db1.usermaster = require("./usermaster.models")(sequelize, DataTypes);
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
db1.userresource = require("./userresource.models")(sequelize, DataTypes);
db1.gendermaster = require("./gendermaster.models")(sequelize, DataTypes);
db1.file = require("./file.models")(sequelize, DataTypes);
db1.fileattachment = require("./fileattachment.models")(sequelize, DataTypes);
db1.bookmarks = require("./userbookmarks.models")(sequelize, DataTypes);
db1.hosteventdetails = require("./hosteventdetails.models")(
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

// userActivityPreference

db1.userActivityPreference = require('./useractivitypreferences.models')(sequelize,DataTypes)
// grievance masters and details
db1.grievancemasters = require('./grievancemasters.models')(sequelize, DataTypes)
db1.grievanceDetails = require('./grievancedetails.models')(sequelize, DataTypes)
// notification table
db1.publicnotifications = require('./publicnotifications.models')(sequelize, DataTypes)

db1.clicklog = require('./clicklog.models')(sequelize,DataTypes)
//facility activities
db1.facilityactivities = require('./facilityactivities.models')(sequelize, DataTypes)
// facility tariff
db1.facilitytariff = require('./facilitytariff.models')(sequelize,DataTypes)
//frequentlyaskquestion
db1.faq = require('./frequentlyaskquestion.models')(sequelize,DataTypes)
//feedback
db1.feedback = require('./feedback.model')(sequelize, DataTypes)
//promotion
db1.promotions = require('./promotion.model')(sequelize, DataTypes)

db1.departmentmasters = require('./departmentmasters.models')(sequelize, DataTypes)
db1.grievancecategories = require('./grievancecategories.models')(sequelize, DataTypes)

db1.facilities.hasMany(db1.facilitybookings,{foreignKey:"facilityId"})
db1.facilitybookings.belongsTo(db1.facilities,{foreignKey:'facilityId'})

db1.facilities.hasMany(db1.facilityactivities,{foreignKey:"facilityId"})
db1.facilityactivities.belongsTo(db1.facilities,{foreignKey:"facilityId"})

db1.useractivitymasters.hasMany(db1.facilityactivities,{foreignKey:"activityId"})
db1.facilityactivities.belongsTo(db1.useractivitymasters,{foreignKey:"activityId"})


db1.faq.sync({
  alter: false,
});

module.exports = db1;
