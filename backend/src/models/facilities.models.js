const{Sequelize,DataTypes} = require('sequelize');
const sequelize = new Sequelize()

const Facility = sequelize.define('facilities',{
    facilityId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    ownership:{
        type:DataTypes.STRING(50)
    },
    facilityTypeId:{
        type:DataTypes.INTEGER
    },
    scheme:{
        type:DataTypes.STRING(20)
    },
    areaAcres:{
        type:DataTypes.DECIMAL
    },
    latitude:{
        type:DataTypes.DECIMAL
    },
    longitude:{
        type:DataTypes.DECIMAL
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

})