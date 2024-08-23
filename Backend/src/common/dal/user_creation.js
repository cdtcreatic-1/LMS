const models = require('cccommon/models/internaldb');

async function createUserCreation(userData) {
    try {
        const newUser = models.UserCreation.build({ ...userData });
        const savedUser = await newUser.save();
        return savedUser;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
}

async function updateUserCreation(userData)
{
    try {
        const user = await models.UserCreation.update({ ...userData }, {
            where: {
                id_user: userData.id_user
            }
        });
        return user;
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }

}

async function deleteUserCreation(id_user) {
    try {
        await models.UserCreation.destroy({
            where: { id_user: id_user }
        });
        return true;
    } catch (error) {
        throw new Error(`Error deleting user creation record: ${error.message}`);
    }
}

module.exports = {
    createUserCreation,
    updateUserCreation,
    deleteUserCreation
};