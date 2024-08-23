const courseSkillsDal = require('cccommon/dal/course_skills_table');
const courseDal = require('cccommon/dal/course');
const skillDal = require('cccommon/dal/skill');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_course, skill_name } = req.body;

    const valErrs = [];

    if (!id_course) {
        valErrs.push({ 'id_course': 'missing' });
    }


    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    const skillRegex = /[@#$^&*()_+\-=\[\]{};':"\\|<>\/]+/
    if (skill_name && skillRegex.test(skill_name)) {
        valErrs.push({ skill_name: 'contains special characters' });
    }


    const onlyDigitsRegex = /^\d+$/;
    if (!onlyDigitsRegex.test(id_course)) {
        appErr.send(req, res, 'invalid_input', 'id_course should contain only numeric values');
        return;
    }

    try {

        const courseSkill = await courseSkillsDal.createCourseSkill({ id_course, skill_name });
        if (!courseSkill) {
            appErr.send(req, res, 'course_skill_preference_exist', 'Course skill preference already exist');
            return;
        }
        res.status(201).send({
            message: 'Course skill association created successfully',
            data: courseSkill
        });

    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to create course skill association');
        return;
    }
};