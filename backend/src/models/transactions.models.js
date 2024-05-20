module.exports = (sequelize,DataTypes)=>{


const Transaction = sequelize.define('transaction',{
    transactionId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    userId:{
        type:DataTypes.INTEGER
    },
    transactionDate:{
        type:DataTypes.DATE
    },
    totalAmount:{
        type:DataTypes.DECIMAL
    },
    paymentMethod:{
        type:DataTypes.STRING(50)
    },
    paymentStatus:{
        type:DataTypes.STRING(50)
    }, 
    createdBy:{
        type:DataTypes.INTEGER
    },
    createdOn: {
        type: DataTypes.DATE, // Define the column as DATE type
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Set default value to current timestamp
    },
    updatedBy:{
        type:DataTypes.INTEGER
    },
    updatedOn: {
        type: DataTypes.DATE // Define the column as DATE type
    },
    deletedBy:{
        type:DataTypes.INTEGER
    },
    deletedOn: {
        type: DataTypes.DATE // Define the column as DATE type
    }

}
,
{
    timestamps:false
}
)

return Transaction

}