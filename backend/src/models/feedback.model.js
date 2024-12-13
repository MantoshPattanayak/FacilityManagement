module.exports = (sequelize, DataTypes) => {
    let Feedback = sequelize.define('feedbacks', {
        feedbackId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        mobile: {
            type: DataTypes.STRING(25),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_0900_ai_ci'
        },
        subject: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        feedback: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        assetTypeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        assetId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdOn: {
            type: DataTypes.DATE,
        },
        createdBy: {
            type: DataTypes.INTEGER,
        },
        updateBy: {
            type: DataTypes.INTEGER,
        },
        updatedOn: {
            type: DataTypes.DATE,
        },
        deleteBy: {
            type: DataTypes.DATE,
        },
        deleteOn: {
            type: DataTypes.DATE,
        },
        isWhatsappNumber: {
            type: DataTypes.TINYINT,
        },
        feedbackReferenceNumber: {
            type: DataTypes.STRING(255)
        }
    },
        {
            timestamps: false
        }
    )
    return Feedback
}