module.exports = (sequelize,DataTypes)=>{

const PaymentMethod = sequelize.define('paymentmethod',{
    methodId : {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    methodName:{
        type:DataTypes.STRING(50)
    },
    description:{
        type:DataTypes.STRING(255)
    },
    isEnabled:{
        type:DataTypes.BOOLEAN(80)
    },
    razorpay_order_id: {
        type: DataTypes.STRING(255),
        allowNull:false,
    },
    razorpay_payment_id: {
        type: DataTypes.STRING(255),
        allowNull:false,
    },
    razorpay_signature: {
        type: DataTypes.STRING(255),
        allowNull:false,
    },  
    status:{
        type: DataTypes.INTEGER // Define the column as DATE type
    },


}
,
{
    timestamps:false
}

)
return PaymentMethod
}

