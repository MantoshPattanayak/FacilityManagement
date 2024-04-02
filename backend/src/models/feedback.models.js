module.exports = (sequelize,DataTypes)=>{

const FeedBack = sequelize.define('feeedback', {
  // Model attributes are defined here
  feedbackId:{
    type:DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  facilityId:{
    type:DataTypes.STRING(150)
  },
  description:{
    type:DataTypes.STRING(255),
  },
  rating:{
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
return FeedBack
}