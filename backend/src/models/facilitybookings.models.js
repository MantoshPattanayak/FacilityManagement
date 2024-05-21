module.exports = (sequelize, DataTypes) => {

    const FacilityBookings = sequelize.define('facilitybookings', {
        // Model attributes are defined here
        facilityBookingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        facilityId: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        sportsName: {
            type: DataTypes.INTEGER,
            defaultValue: null 
        },
        transactionId: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        bookingDate: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        startDate: {
            type: DataTypes.TIME,
            defaultValue: null
        },
        endDate: {
            type: DataTypes.TIME,
            defaultValue: null
        },
        statusId: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        amount: {
            type: DataTypes.DOUBLE,
            defaultValue: null
        },
        paymentstatus: {
            type: DataTypes.STRING(25),
            defaultValue: null
        },
        totalMembers: {
            type: DataTypes.INTEGER,
        },
        otherActivities: {
            type: DataTypes.STRING(100)
        },
        remarks: {
            type: DataTypes.STRING(255),
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
        },
        bookingReference: {
            type: DataTypes.STRING(255),
            defaultValue: null
        }
    }
    ,
    {
        timestamps:false
    }


);
    return FacilityBookings
}