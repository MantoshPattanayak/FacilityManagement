module.exports = (sequelize, DataTypes) => {

    const facilitytariff = sequelize.define('tariffmaster', {
        // Model attributes are defined here
        tariffMasterId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        facilityId:{
            type:DataTypes.INTEGER
        },
        entityId: {
            type: DataTypes.INTEGER,

        },
        tariffTypeId: {
            type: DataTypes.STRING,
     
        },
        statusId: {
            type: DataTypes.INTEGER,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        createdDt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        updatedDt: {
            type: DataTypes.DATE,
            defaultValue: null
        }
    
    }
    ,
    {
        timestamps:false
    }


);
    return facilitytariff
}