module.exports = (sequelize, DataTypes) => {
    let Feedback = sequelize.define('feedback', {
        feedbackId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name:      {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        mobile:   {
            type: DataTypes.STRING(25),
            allowNull: false
        },
        email:    {
            type: DataTypes.STRING(50),
            allowNull: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_0900_ai_ci'

        },
        subject:  {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        feedback: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        createdOn: {
            type: DataTypes.DATE,
        },
        createdBy: {
            type: DataTypes.DATE,
        },
        updateBy: {
            type: DataTypes.DATE,
        },
        updatedOn: {
            type: DataTypes.DATE,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
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
        }
    },
        {
            timestamps: false
        }
    )
    return Feedback
}