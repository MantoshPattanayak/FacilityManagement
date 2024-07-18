module.exports = (sequelize,DataTypes)=>{
    let hostbookings = sequelize.define('hostbookings',{
        hostBookingId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        hostId:{
            type:DataTypes.INTEGER
        },
        transactionId:{
            type:DataTypes.INTEGER
        },
        bookingDate:{
            type:DataTypes.DATEONLY
        },
        startDate:{
            type:DataTypes.DATE
        },
        endDate:{
            type:DataTypes.DATE
        },
        statusId:{
            type:DataTypes.INTEGER
        },
        amount:{
            type:DataTypes.DECIMAL
        },
        paymentStatus:{
            type:DataTypes.STRING(255)
        },
        bookingReferenceNumber:{
            type:DataTypes.STRING(80)
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

    return hostbookings
}