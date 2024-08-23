const models = require('cccommon/models/internaldb');

async function addNewUserRole(id_user, id_role) {
    try {
        const userRole = await models.UserRole.build({ id_user, id_role });
        return await userRole.save();
    } catch (error) {
        throw new Error(`Error adding new user role: ${error.message}`);
    }
}

async function updateUserRole(id_user, id_role) {
    try {
        const userRole = await models.UserRole.update({ id_role }, {
            where: {
                id_user: id_user
            }
        });

        return userRole;

    } catch (error) {
        throw new Error(`Error updating user role: ${error.message}`);
    }
}

async function getUserRole(id_user) {
    try {
        const userRole = await models.UserRole.findOne({
            where: {
                id_user: id_user
            },
        });

        return userRole;

    } catch (error) {

        throw new Error(`Error getting user role: ${error.message}`);
    }
}

async function getIdRoleByIdUser(id_user) {
    try {
        const user = await models.UserRole.findAll({
            where: {
                id_user: id_user
            },
            attributes: ['id_role'],
        });

        return user;

    } catch (error) {
        throw new Error(`Error getting user by id: ${error.message}`);
    }
};

module.exports = {
    addNewUserRole,
    updateUserRole,
    getUserRole,
    getIdRoleByIdUser,
};