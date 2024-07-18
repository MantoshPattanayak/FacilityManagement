module.exports =(sequelize, DataTypes)=>{
    let advertisementtariff = sequelize.define('advertisementtariffmaster',{
        advertisementId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        advertisementTypeId:{
            type:DataTypes.INTEGER
        },
        duration:{
            type:DataTypes.STRING
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


    

    return advertisementtariff
}