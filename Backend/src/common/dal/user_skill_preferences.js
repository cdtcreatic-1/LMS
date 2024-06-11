const models = require('cccommon/models/internaldb');

async function createUserSkillPreference(userSkillPreferenceData) {
    const existingPreference = await getUserSkillPreferencesByUserId(userSkillPreferenceData.id_user, userSkillPreferenceData.id_skill);
    if (existingPreference.length === 0) {
        try {
            const newUserSkillPreference = models.UserSkillPreference.build(userSkillPreferenceData);
            const savedUserSkillPreference = await newUserSkillPreference.save();
            return savedUserSkillPreference;
        } catch (error) {
            throw new Error(`Error creating user skill preference: ${error.message}`);
        }
    } else {
        return false;
    }
};

async function getUserSkillPreferencesByUserId(id_user, id_skill) {
    try {
        const userSkillPreferences = await models.UserSkillPreference.findAll({
            where: {
                id_user: id_user,
                id_skill: id_skill
            }
        });
        console.log("userSkillPreferences ", userSkillPreferences)
        return userSkillPreferences;
    } catch (error) {
        throw new Error(`Error getting user skill preferences: ${error.message}`);
    }
};

async function getUserSkillsByUserId(id_user) {
    try {
        const user_skills = await models.UserSkillPreference.findAll({
            where: {
                id_user: id_user
            }, include: [{
                model: models.CourseSkill,
            }]
        });

        return user_skills;
    } catch (error) {
        throw new Error(`Error getting user skill preferences: ${error.message}`);
    }
};

async function deleteUserSkillPreference(id_preferences) {
    try {
        const userSkillPreference = await models.UserSkillPreference.findOne({
            where: {
                id_preferences: id_preferences
            }
        });
        if (!userSkillPreference) {
            return false;
        }
        await userSkillPreference.destroy();
        return true;
    } catch (error) {
        throw new Error(`Error deleting user skill preference: ${error.message}`);
    }
};

async function deleteUsersSkillPreferences(id_skill) {
    try {
        await models.UserSkillPreference.destroy({
            where: {
                id_skill: id_skill
            }
        });

        return true;
    } catch (error) {
        return false;
        //throw new Error(`Error deleting users skill preferences: ${error.message}`);
    }
};

module.exports = {
    createUserSkillPreference,
    getUserSkillPreferencesByUserId,
    deleteUserSkillPreference,
    deleteUsersSkillPreferences,
    getUserSkillsByUserId
};