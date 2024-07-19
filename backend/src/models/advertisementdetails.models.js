module.exports =(sequelize, DataTypes)=>{
    let advertisementdetails = sequelize.define('advertisementdetail',{
        advertisementDetailId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        advertisementTariffId:{
            type:DataTypes.INTEGER
        },
        advertisementTypeId:{
            type:DataTypes.INTEGER
        },
        advertisementName:{
            type:DataTypes.STRING
        },
        startDate:{
            type:DataTypes.DATE
        },
        endDate:{
            type:DataTypes.DATE
        },
        amount:{
            type:DataTypes.DOUBLE
        },
        statusId:{
            type:DataTypes.INTEGER

        },
        createdBy:{
            type:DataTypes.INTEGER
        },
        createdDt: {
            type: DataTypes.DATE, // Define the column as DATE type
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Set default value to current timestamp
        },
        updatedBy:{
            type:DataTypes.INTEGER
        },
        updatedDt: {
            type: DataTypes.DATE // Define the column as DATE type
        },
      
    
    }
    ,
    {
        timestamps:false
    })


    

    return advertisementdetails
}