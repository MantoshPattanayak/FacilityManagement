const express = require("express");
const app = express();

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const port = process.env.PORT || 7100;
const cors = require("cors");
var cookieParser = require("cookie-parser");
let api_version = process.env.API_VERSION;

const {
  requestLogger,
  errorLogger,
} = require("./middlewares/logger.middlewares");

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

console.log(port, "port");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));
// app.use(passport.initialize());

// here in the express.urlencoded i.e. extended is equal to true means inside object we can give another object
app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb",
  })
);

//  here to access the public assets like images, folders
app.use(express.static("public"));

//  Here cookie parser is used to do crud operation in the user cookie by the server
app.use(cookieParser());

// Use the informational logger middleware before all route handlers
app.use(requestLogger);

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
app.use("/faq", faqRoute);

// Use error logger middleware after all route handlers
app.use(errorLogger);

module.exports = {
  app,
};
