module.exports = (sequelize, DataTypes) => {

    const FacilityAcitivities = sequelize.define('facilityactivities', {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        facilityId: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        facilityTypeId: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        activityId: {
            type: DataTypes.INTEGER,
            defaultValue: null 
        },
        statusId: {
            type: DataTypes.INTEGER,
            defaultValue: null
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
        },
        deletedBy: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        deletedOn: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
    }
    ,
    {
        timestamps:false
    }
);
    return FacilityAcitivities
}