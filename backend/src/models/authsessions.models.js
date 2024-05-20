module.exports = (sequelize,DataTypes)=>{

const AuthSessions = sequelize.define('authsessions',{
    sessionId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    userId:{
        type:DataTypes.INTEGER

    },
    deviceId:{
        type:DataTypes.INTEGER
    },
    lastActivity:{
        type:DataTypes.DATE,
        allowNull:false

    },
    active:{
        type:DataTypes.INTEGER
    }
    

}
,
{
    timestamps:false
}

)
return AuthSessions
}

// Here we need to use a stored procedure that will automatically delete the session expired records.