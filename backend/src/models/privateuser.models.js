const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:'); //change this to mysql

const PrivateUser = sequelize.define('privateuser', {
  // Model attributes are defined here
  privateUserId:{
    type:DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  roleId:{
    type:DataTypes.INTEGER
  },
  title:{
    type:DataTypes.STRING(5)
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  middleName: {
    type: DataTypes.STRING(50)
    // allowNull defaults to true
  },
  lastName: {
    type: DataTypes.STRING(50)
    // allowNull defaults to true
  },
  userName:{
    type:DataTypes.STRING(50)
  },
  password:{
    type:DataTypes.STRING(50)
  },
  phoneNo:{
    type:DataTypes.STRING(15)
  },
  altPhoneNo:{
    type: DataTypes.STRING(50)
  },
  emailId:{
    type:DataTypes.STRING(50)
  },
  panCard:{
    type:DataTypes.STRING(50),
    unique:true
  },
  aadharCard:{
    type:DataTypes.STRING(50),
    unique:true
  },
  lastLogin:{
    type: DataTypes.DATE // Define the column as DATE type
},
  status:{
    type: DataTypes.INTEGER // Define the column as DATE type
},
  remarks:{
    type: DataTypes.STRING(255)
  },
  createdBy:{
    type:DataTypes.INTEGER
  },
  createdOn: {
    type: DataTypes.DATE, // Define the column as DATE type
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Set default value to current timestamp
  },
  updateBy:{
    type:DataTypes.INTEGER
  },
  updatedOn: {
    type: DataTypes.DATE // Define the column as DATE type
  },
  deletedBy:{
    type:DataTypes.INTEGER
  },
  deletedOn: {
    type: DataTypes.DATE // Define the column as DATE type
  }
 
}
);