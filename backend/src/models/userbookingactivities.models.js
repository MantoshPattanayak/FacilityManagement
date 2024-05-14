module.exports = (sequelize, DataTypes) => {

    const UserBookingActivities = sequelize.define('userbookingactivities', {
        userBookingActivityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        facilityBookingId: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        userActivityId: {
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
        createdOn: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        updatedOn: {
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
        }
    }
    ,
    {
        timestamps:false
    }
)
    return UserBookingActivities
}