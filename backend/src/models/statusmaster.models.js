module.exports = (sequelize,DataTypes)=>{

const StatusMaster = sequelize.define('statusmasters', {
  // Model attributes are defined here
  statusId:{
    type:DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  statusCode:{
    type:DataTypes.STRING(150),
    allowNull:false
  },
  description:{
    type:DataTypes.STRING(255),
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
  },
  parentStatusCode: {
    type: DataTypes.STRING(100)
  }
}
,
{
    timestamps:false
}
);
return StatusMaster
}