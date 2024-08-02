module.exports = (sequelize,DataTypes)=>{

    const PaymentItems = sequelize.define('paymentItem',{
        orderItemId : {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        orderId:{
            type:DataTypes.INTEGER
        },
        entityId : {
            type:DataTypes.INTEGER
        },
        entityTypeId:{
            type:DataTypes.INTEGER
        },
        amount:{
            type:DataTypes.DOUBLE
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
    return PaymentItems
    }
    
    