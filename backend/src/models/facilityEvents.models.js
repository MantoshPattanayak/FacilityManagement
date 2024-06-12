module.exports = (sequelize,DataTypes)=>{
    let facilityEvent = sequelize.define('facilityEvents',{
        facilityEventId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        facilityEventCategoryName:{
            type:DataTypes.STRING(255),
    
        },
        facilityId:{
            type:DataTypes.INTEGER
        },
        statusId:{
            type:DataTypes.INTEGER
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
    },
    {
        timestamps:false
    }
)
    
    return facilityEvent
    
    }
    