const models = require('cccommon/models/internaldb');

async function createUserSubmoduleProgress(progressData) {
    try {
        const progress = models.UserSubmoduleProgress.build(progressData);
        const savedProgress = await progress.save();
        return savedProgress;
    } catch (error) {
        throw new Error(`Error creating user submodule progress: ${error.message}`);
    }
}

async function getUserSubmoduleProgressById(id) {
    try {
        const progress = await models.UserSubmoduleProgress.findByPk(id);
        return progress;
    } catch (error) {
        throw new Error(`Error getting user submodule progress by ID: ${error.message}`);
    }
}

async function updateUserSubmoduleProgress(id, progressData) {
    try {
        const progress = await models.UserSubmoduleProgress.findByPk(id);
        if (!progress) {
            throw new Error('UserSubmoduleProgress not found');
        }
        await progress.update(progressData);
        return progress;
    } catch (error) {
        throw new Error(`Error updating user submodule progress: ${error.message}`);
    }
}

async function deleteUserSubmoduleProgress(id) {
    try {
        const progress = await models.UserSubmoduleProgress.findByPk(id);
        if (!progress) {
            throw new Error('UserSubmoduleProgress not found');
        }
        await progress.destroy();
        return true;
    } catch (error) {
        throw new Error(`Error deleting user submodule progress: ${error.message}`);
    }
}

async function getAllUserSubmoduleProgressByUserId(id_user) {
    try {
        const progresses = await models.UserSubmoduleProgress.findAll({
            where: { id_user }
        });
        return progresses;
    } catch (error) {
        throw new Error(`Error retrieving user submodule progresses by user ID: ${error.message}`);
    }
}


module.exports = {
    createUserSubmoduleProgress,
    getUserSubmoduleProgressById,
    updateUserSubmoduleProgress,
    deleteUserSubmoduleProgress,
    getAllUserSubmoduleProgressByUserId,
};
