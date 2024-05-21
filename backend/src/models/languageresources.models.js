module.exports = (sequelize, DataTypes) => {

    const LanguageResources = sequelize.define('languageresources', {
        // Model attributes are defined here
        languageResourceId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        languageResourceKey: {
            type: DataTypes.STRING(100)
        },
        language: {
            type: DataTypes.STRING(25)
        },
        languageResourceValue: {
            type: DataTypes.STRING(sequelize.MAX)
        },
        status: {
            type: DataTypes.INTEGER // Define the column as DATE type
        },
        createdBy: {
            type: DataTypes.INTEGER
        },
        createdOn: {
            type: DataTypes.DATE, // Define the column as DATE type
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Set default value to current timestamp
        },
        updatedBy: {
            type: DataTypes.INTEGER
        },
        updatedOn: {
            type: DataTypes.DATE // Define the column as DATE type
        },
        deletedBy: {
            type: DataTypes.INTEGER
        },
        deletedOn: {
            type: DataTypes.DATE // Define the column as DATE type
        }
    }
    ,
    {
        timestamps:false
    }
);
    return LanguageResources
}