const models = require('cccommon/models/internaldb');

async function createAnswer(answerData) {
    try {
        const newAnswer = models.SubmoduleAnswer.build(answerData);
        return await newAnswer.save();
    } catch (error) {
        throw new Error(`Error creating answer: ${error.message}`);
    }
}

async function getAnswerById(id_answer) {
    try {
        return await models.SubmoduleAnswer.findByPk(id_answer);
    } catch (error) {
        throw new Error(`Error getting answer by id: ${error.message}`);
    }

}

async function getAnswerByIdQuestion(id_question) {
    try {
        return await models.SubmoduleAnswer.findAll({ where: { id_question } });
    } catch (error) {
        throw new Error(`Error getting answer by id_question: ${error.message}`);
    }

}

async function getAnswerByContent(answers_content) {
    try {
        return await models.SubmoduleAnswer.findOne({
            where: {
                answers_content: answers_content
            }
        });
    } catch (error) {
        throw new Error(`Error getting answer by id: ${error.message}`);
    }
}

async function updateAnswer(id_answer, answerData) {
    try {
        const answer = await models.SubmoduleAnswer.findByPk(id_answer);
        if (!answer) throw new Error('Answer not found');
        return await answer.update(answerData);
    } catch (error) {
        throw new Error(`Error updating answer: ${error.message}`);
    }
}

async function deleteAnswer(id_answer) {
    try {
        const answer = await models.SubmoduleAnswer.findByPk(id_answer);
        if (!answer) throw new Error('Answer not found');
        await answer.destroy();
        return true;
    } catch (error) {
        throw new Error(`Error deleting answer: ${error.message}`);
    }
}

module.exports = {
    createAnswer,
    getAnswerById,
    updateAnswer,
    deleteAnswer,
    getAnswerByContent,
    getAnswerByIdQuestion
};