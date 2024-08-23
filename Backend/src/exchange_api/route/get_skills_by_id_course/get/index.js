const courseSkillsDal = require('cccommon/dal/course_skills_table');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
    const { id_course } = req.params;

    try {
        const skills = await courseSkillsDal.getSkillsByCourseId(id_course);

        res.status(200).json({ skills });
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to get skills');
        return;
    }
};