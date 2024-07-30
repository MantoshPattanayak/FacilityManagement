module.exports = (sequelize,DataTypes)=>{

const PaymentMethod = sequelize.define('paymentmethod',{
    orderId : {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    orderDate:{
        type:DataTypes.DATE
    },

    methodName:{
        type:DataTypes.STRING(50)
    },
    amount:{
        type:DataTypes.DOUBLE
    },
    expiresAt:{
        type:DataTypes.DATE
    },
    description:{
        type:DataTypes.STRING(255)
    },
    razorpay_order_id: {
        type: DataTypes.STRING(255),
    },
    razorpay_payment_id: {
        type: DataTypes.STRING(255),
    },
    razorpay_signature: {
        type: DataTypes.STRING(255),
    },  
    statusId:{
        type: DataTypes.INTEGER // Define the column as DATE type
    },
    createdBy:{
        type:DataTypes.INTEGER
    },
    updatedBy:{
        type:DataTypes.INTEGER
    },
    createdDt:{
        type:DataTypes.DATE
    },
    updatedDt:{
        type:DataTypes.DATE
    }


}
,
{
    timestamps:false
}

)
return PaymentMethod
}

