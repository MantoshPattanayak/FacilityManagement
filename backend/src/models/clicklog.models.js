module.exports = (sequelize,DataTypes)=>{
 let clicklog = sequelize.define('clicklog',{
    clickLogId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    userId:{
        type:DataTypes.INTEGER
    },
    macId:{
        type:DataTypes.STRING(255)
    },
    facilityId:{
        type:DataTypes.INTEGER
    },
    latitude:{
        type:DataTypes.DECIMAL
    },
    longitude:{
        type:DataTypes.DECIMAL
    },
    createdDt:{
        type:DataTypes.DATE
    },
    updatedDt:{
        type:DataTypes.DATE
    }

 },
 {
    timestamps:false
})
 return clicklog
}