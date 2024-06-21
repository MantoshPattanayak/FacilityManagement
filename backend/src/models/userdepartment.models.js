module.exports = (sequelize, DataTypes) => {
    let UserDepartment = sequelize.define('userdepartments', {
        userdepartmentsId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        departmentMasterId: {
            type: DataTypes.INTEGER,
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
        statusId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
        {
            timestamps: false
        })
    return UserDepartment
}