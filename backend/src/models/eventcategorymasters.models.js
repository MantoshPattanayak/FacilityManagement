module.exports = (sequelize, DataTypes) => {
    let eventCategory = sequelize.define('eventcategorymasters', {
        eventCategoryId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        eventCategoryName: {
            type: DataTypes.STRING(255),

        },
        statusId: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.STRING(255),
        },
        createdBy: {
            type: DataTypes.INTEGER
        },
        updatedBy: {
            type: DataTypes.INTEGER
        },
        createdDt: {
            type: DataTypes.DATE
        },
        updatedDt: {
            type: DataTypes.DATE
        },
    }, {
        timestamps: false
    })
    return eventCategory
}
