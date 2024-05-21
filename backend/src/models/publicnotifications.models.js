module.exports = (sequelize,DataTypes)=>{



const PublicNotifications = sequelize.define('publicnotifications',{
    publicNotificationsId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    publicNotificationsTitle:{
        type:DataTypes.STRING(150)
    },
    publicNotificationsContent:{
        type:DataTypes.STRING(255)
    },
    statusId:{
        type:DataTypes.INTEGER
    },
    remarks:{
        type:DataTypes.STRING(255)
    },
    validFromDate: {
        type: DataTypes.DATE
    },
    validToDate: {
        type: DataTypes.DATE
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
return PublicNotifications;
}