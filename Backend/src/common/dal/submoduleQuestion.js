const models = require('cccommon/models/internaldb');

async function createQuestion(questionData) {
    try {
        const newQuestion = models.SubmoduleQuestion.build(questionData);
        return await newQuestion.save();
    } catch (error) {
        throw new Error(`Error creating question: ${error.message}`);
    }
}

async function getQuestionById(id_question) {
    try {
        return await models.SubmoduleQuestion.findByPk(id_question);
    } catch (error) {
        throw new Error(`Error getting question by id: ${error.message}`);
    }
}

async function getQuestionByIdSubmodule(id_submodule) {
    try {
        const questions = await models.SubmoduleQuestion.findAll({
            where: {
                id_submodule: id_submodule
            },
        });
        return questions;

    } catch (error) {
        throw new Error(`Error getting questions: ${error.message}`);
    }
};

async function getQuestionByContent(question_content) {
    try {
        return await models.SubmoduleQuestion.findOne({
            where: {
                question_content: question_content
            }
        });
    } catch (error) {
        throw new Error(`Error getting question by id: ${error.message}`);
    }
}

async function updateQuestion(id_question, questionData) {
    try {
        const question = await models.SubmoduleQuestion.findByPk(id_question);

        if (!question) throw new Error('Question not found');
        return await question.update(questionData);
    } catch (error) {
        throw new Error(`Error updating question: ${error.message}`);
    }
}

async function deleteQuestion(id_question) {
    try {
        const transaction = await models.sequelize.transaction();

        const question = await models.SubmoduleQuestion.findByPk(id_question);
        if (!question) {
            await transaction.rollback();
            throw new Error('Question not found');
        }

        await models.SubmoduleAnswer.destroy({
            where: { id_question: id_question },
            transaction
        });

        await question.destroy({ transaction });

        await transaction.commit();
        return true;
    } catch (error) {
        throw new Error(`Error deleting question: ${error.message}`);
    }
}

module.exports = {
    createQuestion,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    getQuestionByContent,
    getQuestionByIdSubmodule
};
