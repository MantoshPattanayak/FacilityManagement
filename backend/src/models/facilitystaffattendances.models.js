module.exports = (sequelize, DataTypes) => {
    let facilityStaffAttendance = sequelize.define('facilitystaffattendances', {
        facilityStaffAttendanceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        facilityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        attendanceDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        checkInTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        checkOutTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdOn: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Set default value to current timestamp
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        updatedOn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        deletedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        deletedOn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        statusId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
        {
            timestamps: false
        })
    return facilityStaffAttendance
}