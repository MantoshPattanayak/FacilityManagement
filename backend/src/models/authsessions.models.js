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
    refreshToken:{
        type:DataTypes.STRING(255),
        unique:true,
        allowNull:false
    },
    sessionExpiration:{
        type:DataTypes.DATE,
        allowNull:false

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

    

})
return AuthSessions
}

// Here we need to use a stored procedure that will automatically delete the session expired records.