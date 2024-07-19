module.exports =(sequelize, DataTypes)=>{
    let advertisementmaster = sequelize.define('advertisementtypemaster',{
        advertisementTypeId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        advertisementType:{
            type:DataTypes.STRING
        },
        description:{
            type:DataTypes.STRING
        },
        durationOption:{
            type:DataTypes.STRING
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


    

    return advertisementmaster
}