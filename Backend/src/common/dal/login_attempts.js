const ecUser = require('cccommon/user');
const models = require('cccommon/models/internaldb');

async function incrementFailedAttempts(userId) {
    const attempts = await getAttemptsByUserId(userId);
    attempts.failed_attempts += 1;
    attempts.last_failed_attempt = new Date();
    await attempts.save();
}


async function getAttemptsByUserId(id_user) {
    let attempt = await models.LoginAttempts.findOne({
        where: {
            id_user: id_user
        }
    });
    if (!attempt) {
        attempt = await createDefaultAttemptsForUserId(id_user);
    }
    return attempt;
}

async function resetFailedAttempts(userId) {
    const attempts = await getAttemptsByUserId(userId);
    attempts.failed_attempts = 0;
    await attempts.save();
}

async function createDefaultAttemptsForUserId(id_user) {
    const defaultAttempt = {
        id_user: id_user,
        failed_attempts: 0,
        last_failed_attempt: null
    };
    return await models.LoginAttempts.create(defaultAttempt);
}

async function deleteLoginAttempts(id_user) {
    try {
        await models.LoginAttempts.destroy({
            where: { id_user: id_user }
        });
        return true;
    } catch (error) {
        throw new Error(`Error deleting login attempts: ${error.message}`);
    }
}

module.exports = {
    incrementFailedAttempts,
    resetFailedAttempts,
    getAttemptsByUserId,
    createDefaultAttemptsForUserId,
    deleteLoginAttempts
};