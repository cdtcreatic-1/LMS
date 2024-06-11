const models = require('cccommon/models/internaldb');

// Fill in the fields for the new user in user_information using models.user_information.build
async function createCurrentWindows(id_user, current_window_id, current_farm_number_lot) {
    try {

        const newCurrentWindows = models.CurrentWindow.build({ id_user: id_user, current_window_id: current_window_id, current_farm_number_lot: current_farm_number_lot });
        const savedCurrentWindows = await newCurrentWindows.save();
        return savedCurrentWindows;

    } catch (error) {

        throw new Error(`Error creating current windows: ${error.message}`);

    }

}

// Update the fileds for the user in user_information using models.UserDocumentation.update using id_user
async function updateCurrentWindows(id_user, current_window_id, current_farm_number_lot) {
    try {

        const updatedCurrentWindows = await models.CurrentWindow.update({ current_window_id: current_window_id, current_farm_number_lot: current_farm_number_lot }, { where: { id_user: id_user } });
        return updatedCurrentWindows;

    } catch (error) {

        throw new Error(`Error updating current windows: ${error.message}`);

    }
}

async function getCurrentWindowsById(id_user) {

    try {
        const current_windows = await models.CurrentWindow.findAll({
            where: {
                id_user: id_user
            },
            attributes: ['id_user', 'current_window_id', 'current_farm_number_lot'],
        });
        return current_windows;

    } catch (error) {

        throw new Error(`Error getting current windows by id_user: ${error.message}`);

    }
}

async function deleteCurrentWindowsByIdUser(id_user) {

    try {
        await models.CurrentWindow.destroy({
            where: {
                id_user: id_user
            }
        });

    } catch (error) {

        throw new Error(`Error deleting current windows by id_user: ${error.message}`);

    }
}


module.exports = {
    createCurrentWindows,
    getCurrentWindowsById,
    updateCurrentWindows,
    deleteCurrentWindowsByIdUser
};