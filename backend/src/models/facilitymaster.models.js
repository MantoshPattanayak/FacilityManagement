module.exports = (sequelize,DataTypes)=>{


const FacilityMaster = sequelize.define('facilitymaster',{
    facilitymasterId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    facilityname:{
        type:DataTypes.STRING(255)
    },
    ownership:{
        type:DataTypes.STRING(50)
    },
    scheme:{
        type:DataTypes.STRING(20)
    },
    address:{
        type:DataTypes.STRING(255)
    },
    status:{
        type:DataTypes.INTEGER
    },
    remarks:{
        type:DataTypes.STRING(255)
    },
    operatingHoursFrom:{
        type:DataTypes.DATE
    },
    operatingHoursTo:{
        type:DataTypes.DATE
    },
    sun:{
        type:DataTypes.INTEGER
    },
    mon:{
        type:DataTypes.INTEGER
    },
    tue:{
        type:DataTypes.INTEGER
    },
    wed:{
        type:DataTypes.INTEGER
    },
    thu:{
        type:DataTypes.INTEGER
    },
    fri:{
        type:DataTypes.INTEGER
    },
    sat:{
        type:DataTypes.INTEGER
    },
    additionalDetails:{
        type:DataTypes.STRING(255)
    },
    createdBy:{
        type:DataTypes.INTEGER
    },
    privateUserId:{
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

})
return FacilityMaster
}