const models = require('cccommon/models/internaldb');

async function getCourseStatusById(id_status) {
    try {
        const learning = await models.CourseStatus.findOne({
            where: {
                id_status: id_status
            },
        });
        return learning;
    } catch (error) {
        throw new Error(`Error getting course profile by id: ${error.message}`);
    }
};


module.exports = {
    getCourseStatusById
};
