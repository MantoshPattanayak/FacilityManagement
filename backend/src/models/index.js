const {Sequelize,DataTypes,QueryTypes} = require('sequelize');
const db=require('../config/db')
// console.log(db,'db credentials')

const sequelize = new Sequelize(
  db.DATABASE, 
  db.USER, 
  db.PASSWORD, {
    host: db.HOST,
    dialect: db.DIALECT,
    logging:false
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  
  const db1 ={}
  db1.Sequelize = Sequelize
  db1.sequelize = sequelize
  db1.DataTypes = DataTypes
  db1.QueryTypes = QueryTypes

  db1.amenitiesmaster = require('./amenitiesmaster.models')(sequelize,DataTypes)
  db1.publicuser = require('./publicuser.models')(sequelize,DataTypes)
  db1.privateuser = require('./privateuser.models')(sequelize,DataTypes)
  db1.amenityfacilities=require('./amenityfacilities.models')(sequelize,DataTypes)
  db1.authsessions = require('./authsessions.models')(sequelize,DataTypes)
  db1.bookinghistory = require('./bookinghistory.models')(sequelize,DataTypes)
  db1.cart=require('./cart.models')(sequelize,DataTypes)
  db1.facilities=require('./facilities.models')(sequelize,DataTypes)
  db1.facilitytype=require('./facilitytype.models')(sequelize,DataTypes)
  db1.parkinventory=require('./parkinventory.models')(sequelize,DataTypes)
  db1.parkinventoryfacilities=require('./parkinventoryfacilities.models')(sequelize,DataTypes)
  db1.payment=require('./payment.models')(sequelize,DataTypes)
  db1.resourcemaster=require('./resourcemaster.models')(sequelize,DataTypes)
  db1.rolemaster = require('./rolemaster.models')(sequelize,DataTypes)
  db1.roleresource = require('./roleresource.models')(sequelize,DataTypes)
  db1.servicefacilities =require('./servicefacilities.models')(sequelize,DataTypes)
  db1.services =require('./services.models')(sequelize,DataTypes)
  db1.statusmaster =require('./statusmaster.models')(sequelize,DataTypes)
  db1.transaction =require('./transactions.models')(sequelize,DataTypes)
  db1.transactiondetails = require('./transactiondetails.models')(sequelize,DataTypes)
  db1.userresource = require('./userresource.models')(sequelize,DataTypes)
  db1.gendermaster = require('./gendermaster.models')(sequelize,DataTypes)
  db1.file = require('./file.models')(sequelize,DataTypes)
  db1.fileattachment = require('./fileattachment.models')(sequelize,DataTypes)
  db1.bookmarks = require('./userbookmarks.models')(sequelize, DataTypes)

  db1.sequelize.sync({
    force: false
  })

module.exports = db1;
