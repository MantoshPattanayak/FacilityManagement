const { sequelize, Sequelize } = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const db = require("../../../models");
const faq = db.faq;
const logger = require('../../../logger/index.logger')

const createFaq = async (req, res) => {
  try {
    console.log("12");
    let createFaq;
    const { facilityTypeId,questionInEnglish, answerInEnglish, questionInOdia, answerInOdia } =
      req.body;
    console.log("hello", req.body);

    const normalizedQuestionInEnglish = questionInEnglish.toLowerCase();
    const normalizedQuestionInOdia = questionInOdia.toLowerCase();

    // Check if the question exists in any case
    const existingFaq = await faq.findOne(
      { questionInEnglish: normalizedQuestionInEnglish },
      { questionInOdia: normalizedQuestionInOdia }
    );
    if (existingFaq) {
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: "FAQ with this question already exists",
      });
    }

    if (
      (questionInEnglish && !answerInEnglish) ||
      (questionInOdia && !answerInOdia)
    ) {
      return res.status(statusCode.BAD_REQUEST.code).json({
        message:
          "If a question is provided, the corresponding answer is required",
      });
    }
    createFaq = await faq.create({
      facilityTypeId:  facilityTypeId,
      questionInEnglish: questionInEnglish,
      answerInEnglish: answerInEnglish,
      questionInOdia: questionInOdia,
      answerInOdia: answerInOdia,
    });
    if (createFaq) {
      return res.status(statusCode.SUCCESS.code).json({
        message: "FAQ created successfully",
      });
    }
    return res.status(statusCode.BAD_REQUEST.code).json({
      message: "FAQ is not created",
    });
  } catch (error) {
    logger.error(`An error occurred: ${error.message}`); // Log the error

    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message,
    });
  }
};

module.exports = {
  createFaq,
};
