module.exports = (sequelize,DataTypes)=>{

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
  fullName: {
    type: DataTypes.STRING(90),
    allowNull: false
  },
  userName:{
    type:DataTypes.STRING(50)
  },
  password:{
    type:DataTypes.STRING(50)
  },
  contactNo:{
    type:DataTypes.STRING(15)
  },
  altContactNo:{
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
  statusId:{
    type: DataTypes.INTEGER // Define the column as DATE type
},
  remarks:{
    type: DataTypes.STRING(255)
  },
  changePwdFlag:{
    type: DataTypes.BOOLEAN,

  },
  gender:{
    type:DataTypes.INTEGER
  },
  createdBy:{
    type:DataTypes.INTEGER
  },
  createdOn: {
    type: DataTypes.DATE, // Define the column as DATE type
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Set default value to current timestamp
  },
  updatedBy:{
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
return PrivateUser

}