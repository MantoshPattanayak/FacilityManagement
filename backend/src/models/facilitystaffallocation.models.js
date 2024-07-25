module.exports = (sequelize, DataTypes) => {
    let facilityStaffAllocation = sequelize.define('facilitystaffallocations', {
        facilityStaffAllocationId: {
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
        allocationStartDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        allocationEndDate: {
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
    return facilityStaffAllocation
}