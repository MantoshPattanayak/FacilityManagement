const express = require("express");
const app = express();

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const port = process.env.PORT || 7100;
const cors = require("cors");
var cookieParser = require("cookie-parser");
let api_version = process.env.API_VERSION;
const uploadDir = process.env.UPLOAD_DIR;
// const {
//   requestLogger,
//   errorLogger,
// } = require("./middlewares/logger.middlewares");
const statusCode = require("./utils/statusCode");
const logger = require('./logger/index.logger')
// const authRoutes= require('./routes/api/'+api_version+'/auth/user')

const maproute = require("./routes/api/" +
  api_version +
  "/configuration/facilites");
const authRoutes = require("./routes/api/" + api_version + "/auth/user");
const userDetails = require("./routes/api/" +
  api_version +
  "/configuration/userDetails");
const roleResource = require("./routes/api/" +
  api_version +
  "/configuration/roleResource");
const userResource = require("./routes/api/" +
  api_version +
  "/configuration/userResource");

const roleroute = require("./routes/api/" +
  api_version +
  "/configuration/role");
const resourceroute = require("./routes/api/" +
  api_version +
  "/configuration/resource");

const eventactivitesroute = require("./routes/api/" +
  api_version +
  "/configuration/eventactivities");

const hosteventdetailsroute = require("./routes/api/" +
  api_version +
  "/configuration/hosteventdetails");

const reviewEventBookingRoute = require("./routes/api/" +
  api_version +
  "/activity/reviewEventBooking");
const faqRoute = require("./routes/api/" + api_version + "/activity/faq");

const publicUser = require("./routes/api/" + api_version + "/auth/public_user");

const razorPayPayment = require("./routes/api/" +
  api_version +
  "/payment/razorPayPayment");
const booking = require("./routes/api/" + api_version + "/booking/booking");
const languageContent = require("./routes/api/" +
  api_version +
  "/configuration/languageContent");
const publicNotifications = require("./routes/api/" +
  api_version +
  "/activity/publicnotifications");
const reports = require("./routes/api/" + api_version + "/reports/reports");
//promotion
const promotionRoute = require('./routes/api/' + api_version + '/activity/promotion')

// grievance
const grievance = require('./routes/api/' + api_version + '/activity/grievance');

const facilityRegistration = require('./routes/api/'+ api_version + '/mdm/registration')

const tariffRoute = require(`./routes/api/`+api_version+`/mdm/tariff`)

const services = require('./routes/api/' + api_version + '/mdm/services')

const amenities = require('./routes/api/' + api_version + '/mdm/amenities')

const inventories = require('./routes/api/' + api_version + '/mdm/inventory')

const eventcategories = require('./routes/api/' + api_version + '/mdm/eventcategories')

const facilityType = require('./routes/api/' + api_version + '/mdm/facilitytype')

const gallery = require('./routes/api/' + api_version + '/activity/gallery')

const facilityStaff = require('./routes/api/' + api_version + '/mdm/facilitystaff')

const userActivity = require('./routes/api/' + api_version + '/mdm/useractivities')
console.log(port, "port");


app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use('/static', express.static(uploadDir));

app.use(express.json({ limit: "20mb" }));
// app.use(passport.initialize());

// here in the express.urlencoded i.e. extended is equal to true means inside object we can give another object
app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb",
  })
);



//  Here cookie parser is used to do crud operation in the user cookie by the server
app.use(cookieParser());

// Use the informational logger middleware before all route handlers
// app.use(requestLogger);
app.use((req,res,next)=>{
  console.log('inside logger info')
  logger.info(`Received ${req.method} request for ${req.url}`);
  next();
})

app.use("/mapData", maproute);
app.use("/auth", authRoutes);
app.use("/userDetails", userDetails);
app.use("/roleResource", roleResource);
app.use("/userResource", userResource);
app.use("/role", roleroute);
app.use("/resource", resourceroute);
//public user
app.use("/publicUser", publicUser);
//event activities
app.use("/eventactivites", eventactivitesroute);
//host event details
app.use("/hosteventdetails", hosteventdetailsroute);

app.use("/razorPayPayment", razorPayPayment);
app.use("/booking", booking);
app.use("/languageContent", languageContent);
//  put all your route handlers here

//activity routes
app.use("/reviewEvents", reviewEventBookingRoute);
// app.use("/grievance",grievanceRoute)
app.use("/faq", faqRoute);
app.use("/publicNotifications", publicNotifications);
app.use("/reports", reports);
app.use('/grievance', grievance);
app.use('/adminFacility',facilityRegistration)
//promotion
app.use("/promotion", promotionRoute)

// tariff
app.use("/tariffData",tariffRoute)
//services-master
app.use('/services', services)
//amenities-master
app.use('/amenities', amenities)
//inventories-master
app.use('/inventories', inventories)
//event-categories
app.use('/eventcategories', eventcategories)
//facility-type master
app.use('/facilitytype', facilityType)
// gallery details
app.use('/gallery', gallery)
// facility staff allocation
app.use("/facilityStaff", facilityStaff)
// user activity master
app.use("/userActivity", userActivity)
// Use error logger middleware after all route handlers
// app.use(errorLogger);

require('./utils/cronJob')

app.use((err,req,res,next)=>{
  if(err){
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:"something went wrong"
    })
  }
})


// const cleanupExpiredTransactions = async () => {
//   const now = new Date();
//   await Transaction.deleteMany({ expiresAt: { $lt: now }, status: 'pending' });
// };

// setInterval(cleanupExpiredTransactions, 60 * 60 * 1000); // Run cleanup every hour

module.exports = {
  app,
};
