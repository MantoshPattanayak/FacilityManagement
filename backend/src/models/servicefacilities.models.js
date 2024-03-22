const {Sequelize , DataTypes} = require('sequelize')

const sequelize = new Sequelize('')

const ServiceFacility = sequelize.define('servicefacilities',{
    seriviceFacilityId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    serviceId:{
        type:DataTypes.INTEGER
    },
    status:{
        type:DataTypes.INTEGER
    },
    remarks:{
        type:DataTypes.STRING
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