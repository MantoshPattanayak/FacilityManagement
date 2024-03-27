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
    status:{
        type: DataTypes.INTEGER // Define the column as DATE type
    },


})
return PaymentMethod
}