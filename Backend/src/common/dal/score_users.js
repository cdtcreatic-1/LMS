const models = require('cccommon/models/internaldb');

async function getScoreUsersByIdUser(id_user) {
    try {
        const ScoreUsers = await models.ScoreUsers.findAll({
            where: {
                id_user: id_user
            }
        });
        return ScoreUsers;
    } catch (error) {
        throw new Error(`Error getting score users: ${error.message}`);
    }
}

async function getScoreUsersByIdUserAndIdUsers(id_user) {
    try {
        const ScoreUsers = await models.ScoreUsers.findAll({
            where: {
                id_user: id_user
            }
        });
        return ScoreUsers;
    } catch (error) {
        throw new Error(`Error getting score users: ${error.message}`);
    }
}

async function saveScoreUsers(ScoreUsers) {
    try {
        const ScoreUsersSaved = await models.ScoreUsers.build(ScoreUsers);
        await ScoreUsersSaved.save();
        return ScoreUsersSaved;
    } catch (error) {
        throw new Error(`Error saving score users: ${error.message}`);
    }
}

async function updateScoreUsers(ScoreUsers) {
    try {
        const ScoreUsersUpdated = await models.ScoreUsers.update(ScoreUsers, {
            where: {
                id_user: ScoreUsers.id_user
            }
        });
        return ScoreUsersUpdated;
    } catch (error) {
        throw new Error(`Error updating score users: ${error.message}`);
    }
}

async function deleteScoreUsers(ScoreUsers) {

    try {
        const ScoreUsersDeleted = await models.ScoreUsers.destroy({
            where: {
                id_user: ScoreUsers.id_user
            }
        });
        return ScoreUsersDeleted;
    } catch (error) {
        throw new Error(`Error deleting score users: ${error.message}`);
    }
}

module.exports = {
    getScoreUsersByIdUser,
    
    getScoreUsersByIdUserAndIdUsers,
    saveScoreUsers,
    updateScoreUsers,
    deleteScoreUsers
};