const models = require('cccommon/models/internaldb');

async function getUserFamerDataById(id_user) {
    try {
        const user = await models.user_information.findOne({
            
            attributes: ['user_personal_description_text', 'id_type_of_information'],
            include: [{
                model: models.User,
                required: true,
                attributes: ['user_name', 'user_phone', 'user_email', 'user_username', 'user_cover_photo', 'user_profile_photo'],
            }],
            where: {
                id_user: id_user,
                id_type_of_information: 1 
            }

        });

        return user;

    } catch (error) {
        throw new Error(`Error getting user by id: ${error.message}`);
    }
};

// En farmerDal.js

async function updateUserFamerDataById(userData) {
    try {
        const user = await models.User.update(userData, {
            where: {
                id_user: userData.id_user
            },
            returning: true,
            plain: true
        });
        
        return user;
    } catch (error) {
        throw new Error(`Error updating user by id: ${error.message}`);
    }
}

module.exports = {
    getUserFamerDataById,
    updateUserFamerDataById
};
  