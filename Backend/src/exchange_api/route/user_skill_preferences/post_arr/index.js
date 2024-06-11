const userSkillPreferencesDal = require('cccommon/dal/user_skill_preferences');
const courseSkillDal = require('cccommon/dal/course_skills_table');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_user, data } = req.body;
    console.log({data});
    const valErrs = [];
    if (!id_user) {
        valErrs.push({ 'id_user': 'missing' });
    }
    if (!data || data.length === 0) {
        valErrs.push({ 'data': 'missing' });
    }

    if (valErrs.length) {
        return appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
    }

    const onlyDigitsRegex = /^\d+$/;
    if (!onlyDigitsRegex.test(id_user)) {
        return appErr.send(req, res, 'invalid_input', 'id_user and id_skill should contain only numeric values');
    }

    try {
        const userExists = await userDal.getUserByIdUser(id_user);
        if (!userExists) {
            return appErr.send(req, res, 'user_not_found', 'User not found');
        }

        for (const skill of data) {
            const { id_skill } = skill;

            const courseSkillExists = await courseSkillDal.getSkillsBySkillsId(id_skill);
            if (!courseSkillExists) {
                return appErr.send(req, res, 'course_skill_not_found', 'Course skill not found');
            }

            const userSkillPreference = await userSkillPreferencesDal.createUserSkillPreference({ id_user, id_skill });
            if (!userSkillPreference) {
                return res.status(400).json({ ok: false, msg: "user_skill_preference_exist - User skill preference already exists" });
            }
        }

        return res.status(201).send({
            ok: true,
            message: 'User skill preference created successfully',
        });
    } catch (error) {
        return appErr.handleRouteServerErr(req, res, error, 'failed to create user skill preference');
    }
};

