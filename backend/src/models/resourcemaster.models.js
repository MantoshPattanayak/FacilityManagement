module.exports = (sequelize,DataTypes)=>{

const ResourceMaster = sequelize.define('resourcemaster', {
  // Model attributes are defined here
  resourceId:{
    type:DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name:{
    type:DataTypes.STRING(150),
    allowNull:false
  },
  description:{
    type:DataTypes.STRING(150)
  },
  hasSubMenu:{
    type: DataTypes.BOOLEAN
  },
  icon:{
    type:DataTypes.STRING(255)
  },
  iconId:{
    type:DataTypes.INTEGER
  },
  iconType:{
    type:DataTypes.STRING(255)
  },
  parentResourceId:{
    type:DataTypes.INTEGER
  },
  orderIn:{
    type:DataTypes.INTEGER
  },
  path:{
    type:DataTypes.STRING
  },
  statusId:{
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

return ResourceMaster
}