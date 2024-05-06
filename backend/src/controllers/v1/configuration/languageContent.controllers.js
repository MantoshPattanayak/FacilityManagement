const { sequelize, Sequelize } = require('../../../models');
const statusCode = require('../../../utils/statusCode');
const db = require('../../../models');
const bcrypt = require('bcrypt');
const languageresources = db.languageresources;

let viewLanguageContent = async (req, res) => {
    try {
        let languageContentResultData = await languageresources.findAll();

        res.status(statusCode.SUCCESS.code).json({
            message: 'language content',
            languageContentResultData
        })
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let insertLanguageContent = async (req, res) => {
    try {
        let {
            languageResourceKey,
            language,
            languageResourceValue,
        } = req.body;

        let insertQueryResult = await languageresources.create({
            languageResourceKey: languageResourceKey,
            language: language,
            languageResourceValue: languageResourceValue,
            status: 1,
            createdBy: 1,
            createdOn: new Date()
        });

        console.log("insert query result", insertQueryResult);
        res.status(statusCode.SUCCESS.code).json({
            message: 'insert language content',
            data: insertQueryResult
        })
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

module.exports = {
    viewLanguageContent,
    insertLanguageContent
}