const models = require('cccommon/models/internaldb');

async function createEvaluation(evaluationData) {
    try {
        const newEvaluation = models.SubmoduleEvaluation.build(evaluationData);
        return await newEvaluation.save();
    } catch (error) {
        throw new Error(`Error creating evaluation: ${error.message}`);
    }
}

async function getEvaluationById(id_evaluation) {
    try {
        return await models.SubmoduleEvaluation.findByPk(id_evaluation);
    } catch (error) {
        throw new Error(`Error getting evaluation by id: ${error.message}`);
    }
}

async function getEvaluationByIdSubmodule(id_submodule) {
    try {
        const evaluations = await models.SubmoduleEvaluation.findAll({
            where: {
                id_submodule: id_submodule
            },
        });
        return evaluations;

    } catch (error) {
        throw new Error(`Error getting evaluations: ${error.message}`);
    }
};

async function getEvaluationByTitle(evaluation_title) {
    try {
        const submodule = await models.SubmoduleEvaluation.findOne({
            where: {
                evaluation_title: evaluation_title
            },
        });

        return submodule;
    } catch (error) {
        throw new Error(`Error getting evaluation by id: ${error.message}`);
    }
}

async function updateEvaluation(id_evaluation, evaluationData) {
    try {
        const evaluation = await models.SubmoduleEvaluation.findByPk(id_evaluation);
        if (!evaluation) throw new Error('Evaluation not found');
        return await evaluation.update(evaluationData);
    } catch (error) {
        throw new Error(`Error updating evaluation: ${error.message}`);
    }
}

async function deleteEvaluation(id_evaluation) {
    const transaction = await models.sequelize.transaction();
    try {
        const evaluation = await models.SubmoduleEvaluation.findByPk(id_evaluation, { transaction });
        if (!evaluation) {
            await transaction.rollback();
            throw new Error('Evaluation not found');
        }

        const questions = await models.SubmoduleQuestion.findAll({
            where: { id_evaluation: id_evaluation },
            transaction
        });

        for (const question of questions) {
            await models.SubmoduleAnswer.destroy({
                where: { id_question: question.id },
                transaction
            });
            await question.destroy({ transaction });
        }

        await evaluation.destroy({ transaction });

        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw new Error(`Error deleting evaluation with questions and answers: ${error.message}`);
    }
}

module.exports = {
    createEvaluation,
    getEvaluationById,
    getEvaluationByTitle,
    updateEvaluation,
    deleteEvaluation,
    getEvaluationByIdSubmodule
};