const userSkillPreferencesDal = require('cccommon/dal/user_skill_preferences');
const courseSkillDal = require('cccommon/dal/course_skills_table');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_user, id_skill } = req.body;

    const valErrs = [];
    if (!id_user) {
        valErrs.push({ 'id_user': 'missing' });
    }
    if (!id_skill) {
        valErrs.push({ 'id_skill': 'missing' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }
    
    const onlyDigitsRegex = /^\d+$/;
    if (!onlyDigitsRegex.test(id_user) || !onlyDigitsRegex.test(id_skill)) {
        appErr.send(req, res, 'invalid_input', 'id_user and id_skill should contain only numeric values');
        return;
    }
    
    try {
        const userExists = await userDal.getUserByIdUser(id_user);
        if (!userExists) {
            appErr.send(req, res, 'user_not_found', 'User not found');
            return;
        }
        const courseSkillExists = await courseSkillDal.getSkillsBySkillsId(id_skill);
        if (!courseSkillExists) {
            appErr.send(req, res, 'course_skill_not_found', 'Course skill not found');
            return;
        }

        const userSkillPreference = await userSkillPreferencesDal.createUserSkillPreference({ id_user, id_skill });
        if (!userSkillPreference) {
            appErr.send(req, res, 'user_skill_preference_exist', 'User skill preference already exists');
            return;
        }     
        
        res.status(201).send({
            message: 'User skill preference created successfully',
            userSkillPreference
        });
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to create user skill preference');
        return;
    }
};
