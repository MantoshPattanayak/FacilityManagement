module.exports = (sequelize, DataTypes) => {

    const EventBookings = sequelize.define('eventbookings', {
        // Model attributes are defined here
        eventBookingId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        transactionId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        bookingDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        startDate: {
            type: DataTypes.TIME,
            allowNull: true
        },
        endDate: {
            type: DataTypes.TIME,
            allowNull: true
        },
        statusId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        paymentstatus: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        remarks: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        createdOn: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedOn: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deletedBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        deletedOn: {
            type: DataTypes.DATE,
            allowNull: true
        },
        bookingReference: {
            type: DataTypes.STRING(80),
            allowNull: true
        }
    });
    return EventBookings
}