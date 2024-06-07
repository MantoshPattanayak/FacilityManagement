module.exports = (sequelize, DataTypes) => {
    let GrievanceCategories = sequelize.define('grievancecategories', {
        grievanceCategoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        grievanceCategoryName: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        grievanceCategoryCode: {
            type: DataTypes.STRING(100),
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
        }
    },
    {
        timestamps: false
    }
    )
    return GrievanceCategories
}