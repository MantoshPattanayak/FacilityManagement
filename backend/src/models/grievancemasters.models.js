module.exports = (sequelize, DataTypes) => {
    let GrievanceMasters = sequelize.define('grievancemasters', {
        grievanceMasterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        fullname: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        emailId: {
            type: DataTypes.STRING(50),
            allowNull: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_0900_ai_ci'
        },
        phoneNo: {
            type: DataTypes.STRING(25),
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        details: {
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
        filepath: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        remarks: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        lastResponseDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        complaintReferenceNumber: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        isWhatsappNumber: {
            type: DataTypes.TINYINT,
            allowNull: true
        }
    },
        {
            timestamps: false
        }
    )
    return GrievanceMasters
}