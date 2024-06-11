const models = require('cccommon/models/internaldb');

async function createCourseSkill(courseSkillData) {
    try {
        const newCourseSkill = models.CourseSkill.build(courseSkillData);
        const savedCourseSkill = await newCourseSkill.save();

        return savedCourseSkill;
    } catch (error) {        
        throw new Error(`Error creating course-skill association: ${error.message}`);
    }
};


async function getSkillsBySkillsId(id_skill) {
    try {
        const courseSkills = await models.CourseSkill.findAll({
            where: {
                id_skill: id_skill
            }
        });
        return courseSkills;
    } catch (error) {
        throw new Error(`Error getting course skills: ${error.message}`);
    }
};

async function getSkillsByCourseId(id_course) {
    try {
        const courseSkills = await models.CourseSkill.findAll({
            where: {
                id_course: id_course
            }
        });
        return courseSkills;
    } catch (error) {
        throw new Error(`Error getting course skills: ${error.message}`);
    }
};

async function deleteCourseSkill(id_skill) {
    try {
        const courseSkill = await models.CourseSkill.findOne({
            where: {
                id_skill: id_skill
            }
        });
        if (!courseSkill) {
            return false;
        }
        await courseSkill.destroy();
        return true;
    } catch (error) {
        throw new Error(`Error deleting course-skill association: ${error.message}`);
    }
};

async function deleteCoursesSkill(id_skill) {
    try {
        await models.CourseSkill.destroy({
            where: {
                id_skill: id_skill
            }
        });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = {
    createCourseSkill,
    getSkillsBySkillsId,
    deleteCourseSkill,
    deleteCoursesSkill,
    getSkillsByCourseId
};