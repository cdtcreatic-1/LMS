const courseSkillDal = require('cccommon/dal/course_skills_table');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_skill } = req.params;
    const valErrs = [];

    if (!id_skill) {
        return appErr.send(req, res, 'missing_id', 'Skill ID missing');
    }

    const onlyDigitsRegex = /^\d+$/;
    if (!onlyDigitsRegex.test(id_skill)) {
        valErrs.push({ id_skill: 'should contain only numeric values' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        const deleted = await courseSkillDal.deleteCourseSkill(id_skill);

        console.log(deleted);

        if (!deleted) {
            return appErr.send(req, res, 'course_skill_not_found', 'CourseSkill association not found');
        }

        res.status(200).send({ message: 'CourseSkill association deleted successfully' });
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to delete CourseSkill association');
    }
};
