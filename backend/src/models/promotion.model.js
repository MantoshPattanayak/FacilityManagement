module.exports = (sequelize, DataTypes) => {
    let Promotion = sequelize.define('promotion', {
        promotionRequestId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name:      {
            type: DataTypes.STRING(25),
        },
        email:    {
            type: DataTypes.STRING(50),
            charset: 'utf8mb4',
            collate: 'utf8mb4_0900_ai_ci'
        },
        offcialContactNumber:  {
            type: DataTypes.STRING(25),
        },
        officialAddress:  {
            type: DataTypes.STRING(100),
        },
        duration: {
            type: DataTypes.INTEGER,
        },
        imageUrl:{
            type:DataTypes.STRING(255)
        },
        statusId: {
            type: DataTypes.INTEGER,
        },
        paymentDone: {
            type: DataTypes.TINYINT,
        },
        transactionId: {
            type: DataTypes.INTEGER,
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
        
    },
        {
            timestamps: false
        }
    )
    return  Promotion
}