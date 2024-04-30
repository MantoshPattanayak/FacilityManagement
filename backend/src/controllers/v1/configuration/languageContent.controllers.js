const { sequelize, Sequelize } = require('../../../models');
const statusCode = require('../../../utils/statusCode');
const db = require('../../../models');
const bcrypt = require('bcrypt');
const languageResources = db.languageResources;

let viewLanguageContent = async (req, res) => {
    try {
        
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}