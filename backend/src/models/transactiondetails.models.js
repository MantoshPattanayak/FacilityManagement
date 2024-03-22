const {Sequelize,DataTypes} = require('sequelize');
const sequelize = new Sequelize('')

const TransactionDetails = sequelize.define('transactiondetails',{
    detailsId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    transactionId:{
        type:DataTypes.INTEGER

    },
    facilityId:{
        type:DataTypes.INTEGER
    },
    startDateTime:{
        type:DataTypes.DATE
    },
    endDateTime:{
        type:DataTypes.DATE
    },
    bookingType:{
        type:DataTypes.STRING(50)
    },
    totalAmount:{
        type:DataTypes.DECIMAL
    },
    quantity:{
        type:DataTypes.INTEGER
    }, //Quantity of the facility booked (e.g., number of hours for a sports arena booking)
    bookingStatus:{
        type:DataTypes.STRING(50)
    },
    paymentStatus:{
        type:DataTypes.STRING(50)
    },
    paymentMethod:{
        type:DataTypes.STRING(50)
    },
    paymentReference:{
        type:DataTypes.STRING(50)
    }, //ABC123 (reference number or ID of the payment transaction).
    createdBy:{
        type:DataTypes.INTEGER
    },
    createdOn: {
        type: DataTypes.DATE, // Define the column as DATE type
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Set default value to current timestamp
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

    

})