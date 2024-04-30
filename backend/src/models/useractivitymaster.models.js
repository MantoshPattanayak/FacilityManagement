module.exports = (sequelize, DataTypes) => {

    const UserActivityMasters = sequelize.define('useractivitymasters', {
        userActivityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        userActivityName: {
            type: DataTypes.STRING(100),
            defaultValue: null,
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
    })
    return UserActivityMasters
}