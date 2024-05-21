module.exports = (sequelize, DataTypes) => {
    let GrievanceDetails = sequelize.define('grievancedetails', {
        grievancedetailId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        grievanceMasterId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        details: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        response: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        actionTakeBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        actionTakenDate: {
            type: DataTypes.DATE,
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
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        statusId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lastResponseDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        departmentMasterId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
    )
    return GrievanceDetails
}