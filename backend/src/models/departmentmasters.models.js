module.exports = (sequelize, DataTypes) => {
    let DepartmentMasters = sequelize.define('departmentmasters', {
        departmentMasterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdOn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updatedOn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        statusid: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        remarks: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
        {
            timestamps: false
        })
    return DepartmentMasters
}