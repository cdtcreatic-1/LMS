const models = require('cccommon/models/internaldb');

async function getCourseProfileById(id_course_profile) {
    try {
        const learning = await models.CourseProfile.findOne({
            where: {
                id_course_profile: id_course_profile
            },
        });
        return learning;
    } catch (error) {
        throw new Error(`Error getting course profile by id: ${error.message}`);
    }
};


module.exports = {
    getCourseProfileById
};
