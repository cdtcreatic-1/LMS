const models = require('cccommon/models/internaldb');

async function createObjective(objectiveData) {
    try {
        const newObjective = models.CourseObjective.build(objectiveData);
        const savedObjective = await newObjective.save();
        return savedObjective;
    } catch (error) {
        throw new Error(`Error creating course objective: ${error.message}`);
    }
};

async function getObjectiveById(id_objective) {
    try {
        const objective = await models.CourseObjective.findOne({
            where: {
                id_objective: id_objective
            },
        });
        return objective;
    } catch (error) {
        throw new Error(`Error getting course objective by id: ${error.message}`);
    }
};

async function getAllObjectives() {
    try {
        const objective = await models.CourseObjective.findAll();
        return objective;
    } catch (error) {
        throw new Error(`Error getting course objective by id: ${error.message}`);
    }
};

async function updateObjective(id_objective, updateData) {
    try {
        const course = await models.CourseObjective.findByPk(id_objective);
        if (!course) {
            throw new Error('Course objective not found');
        }
        await course.update(updateData);
        return course.toJSON();
    } catch (error) {
        throw new Error(`Error updating course objective: ${error.message}`);
    }
};

async function getObjectivesByIdCourse(id_course) {
    try {
        const objectives = await models.CourseObjective.findAll({
            where: {
                id_course: id_course
            },
        });
        return objectives;
    } catch (error) {
        throw new Error(`Error getting objectives course`);
    }
};

async function deleteObjectiveCourse(id_objective) {
    try {
        const courseObjective = await models.CourseObjective.findOne({
            where: {
                id_objective: id_objective
            }
        });

        if (courseObjective === null) {
            return false;
        }
        await courseObjective.destroy();
        return true;
    } catch (error) {
        throw new Error(`Error deleting objective: ${error.message}`);
    }
};

module.exports = {
    createObjective,
    getObjectiveById,
    updateObjective,
    getAllObjectives,
    getObjectivesByIdCourse,
    deleteObjectiveCourse
};
