const models = require('cccommon/models/internaldb');

async function createLearning(learningData) {
    try {
        const newLearning = models.CourseLearning.build(learningData);
        const savedLearning = await newLearning.save();
        return savedLearning;
    } catch (error) {
        throw new Error(`Error creating course learning: ${error.message}`);
    }
};

async function getLearningById(id_learning) {
    try {
        const learning = await models.CourseLearning.findOne({
            where: {
                id_learning: id_learning
            },
        });
        return learning;
    } catch (error) {
        throw new Error(`Error getting course learning by id: ${error.message}`);
    }
};

async function updateLearning(id_learning, updateData) {
    try {
        const course = await models.CourseLearning.findByPk(id_learning);
        if (!course) {
            throw new Error('Course learning not found');
        }
        await course.update(updateData);
        return course.toJSON();
    } catch (error) {
        throw new Error(`Error updating course learning: ${error.message}`);
    }
};

module.exports = {
    createLearning,
    getLearningById,
    updateLearning
};
