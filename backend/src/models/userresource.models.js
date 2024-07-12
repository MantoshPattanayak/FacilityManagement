module.exports = (sequelize,DataTypes)=>{

    const userResource = sequelize.define('userResource', {
      // Model attributes are defined here
      userResourceId:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId:{
        type:DataTypes.INTEGER
      },
      resourceId:{
        type:DataTypes.STRING(150),
        allowNull:false
      },
      statusId:{
        type: DataTypes.INTEGER // Define the column as DATE type
    },
      parentResourceId:{
        type:DataTypes.INTEGER
      },
      remarks:{
        type: DataTypes.STRING(255)
      },
      createdBy:{
        type:DataTypes.INTEGER
      },
      createdDt: {
        type: DataTypes.DATE, // Define the column as DATE type
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Set default value to current timestamp
      },
      updatedBy:{
        type:DataTypes.INTEGER
      },
      updatedDt: {
        type: DataTypes.DATE // Define the column as DATE type
      }  
     
    },
{
    timestamps:false
}
    );
    
    return userResource
    
    }