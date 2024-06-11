const skillDal = require('cccommon/dal/skill');
const userSkillPreferencesDal = require('cccommon/dal/user_skill_preferences');
const courseSkillsDal = require('cccommon/dal/course_skills_table');
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
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const fieldsToCheckForSpecialChars = [
        'skill_name',
        'skill_description'
    ];
    fieldsToCheckForSpecialChars.forEach(field => {
        if (req.body[field] && specialCharsRegex.test(req.body[field])) {
            valErrs.push({ [field]: 'contains special characters' });
        }
    });

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {

        const userSkillDeleted = await userSkillPreferencesDal.deleteUsersSkillPreferences(id_skill);

        if (!userSkillDeleted) {
            return res.status(400).json({ ok: false, msg: "UserSkill not found" });
        }

        const courseSkillDeleted = await courseSkillsDal.deleteCoursesSkill(id_skill);

        if (!courseSkillDeleted) {
            return res.status(400).json({ ok: false, msg: "CurseSkill not found" });
        }


        const deleted = await skillDal.deleteSkill(id_skill);
        if (!deleted) {
            return res.status(400).json({ ok: false, msg: "Skill not found" });
        }

        res.status(200).send({ message: 'Skill deleted successfully' });
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to delete skill');
    }
};
