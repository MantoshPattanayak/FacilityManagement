module.exports = (sequelize,DataTypes)=>{
    let refundModel = sequelize.define('refund',{
        refundId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        orderId:{
            type:DataTypes.INTEGER
        },
        refundReason:{
            type:DataTypes.TEXT
        },
        refundAmount:{
            type:DataTypes.DOUBLE
        },
        refundStatus:{
            type:DataTypes.INTEGER
        },
        razorpay_refund_id:{
            type: DataTypes.STRING(255),
        },
        refundTimestamp:{
            type:DataTypes.DATE
        },
        razorpay_payment_id: {
            type: DataTypes.STRING(255),
        },
        statusId:{
            type:DataTypes.INTEGER
        },
        createdBy:{
            type:DataTypes.INTEGER
        },
        createdDt:{
            type:DataTypes.DATE
        },
        updatedBy:{
            type:DataTypes.INTEGER
        },
        updatedDt:{
            type:DataTypes.DATE
        }

    })
    return refundModel
}