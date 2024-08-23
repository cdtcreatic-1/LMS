const userSkillPreferenceDal = require('cccommon/dal/user_skill_preferences');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_preferences } = req.params;
    const valErrs = [];
    
    if (!id_preferences) {
        return appErr.send(req, res, 'missing_id', 'User Skill Preferences ID missing');
    }
    const onlyDigitsRegex = /^\d+$/;
    if (!onlyDigitsRegex.test(id_preferences)) {
        valErrs.push({ id_preferences: 'should contain only numeric values' });
    }
    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        const deleted = await userSkillPreferenceDal.deleteUserSkillPreference(id_preferences);
        if (!deleted) {
            return appErr.send(req, res, 'user_skill_preference_not_found', 'User skill preferences not found');
        }

        res.status(200).send({ message: 'User skill preferences deleted successfully' });
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to delete user skill preferences');
    }
};
