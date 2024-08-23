const ecUser = require('cccommon/user');
const models = require('cccommon/models/internaldb');


async function createUser(userData) {
    try {
        const hashedPassword = ecUser.genPasswordSync(userData.user_password);
        const newUser = models.User.build({ ...userData, user_password: hashedPassword });
        const savedUser = await newUser.save();
        savedUser.user_token = ecUser.genTokenSync(savedUser.id_user);
        return savedUser;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
};

async function updateUserCoverPhoto(id_user, user_cover_photo) {
    try {
        const user = await models.User.update({ user_cover_photo: user_cover_photo }, {
            where: {
                id_user: id_user
            }
        });

        return user;

    } catch (error) {
        throw new Error(`Error updating user cover photo: ${error.message}`);
    }
}

async function updateUserProfilePhoto(id_user, user_profile_photo) {
    try {
        const user = await models.User.update({ user_profile_photo: user_profile_photo }, {
            where: {
                id_user: id_user
            }
        });

        return user;

    } catch (error) {

        throw new Error(`Error updating user profile photo: ${error.message}`);
    }
}

async function getUserByEmail(user_email) {
    try {
        const user = await models.User.findOne({
            where: {
                user_email: user_email
            },
        });
        let userResult;
        console.log("Entra")

        if (user) {
            userResult = user.toJSON();
            userResult.user_token = ecUser.genTokenSync(user.id_user);
        }
        return userResult;

    } catch (error) {
        throw new Error(`Error getting user by email: ${error.message}`);
    }
};

async function getUserByDocumentNumber(number_document) {
    try {
        return await models.User.findOne({
            where: { number_document }
        });
    } catch (error) {
        throw new Error(`Error getting user by document number: ${error.message}`);
    }
}

async function incrementFailedAttempts(user_email) {
    const user = await models.User.findOne({
        where: {
            user_email: user_email
        }
    });
    if (user) {
        user.failed_attempts += 1;
        user.last_failed_attempt = new Date();
        await user.save();
    }
}

async function resetFailedAttempts(user_email) {
    const user = await models.User.findOne({
        where: {
            user_email: user_email
        }
    });
    if (user) {
        user.failed_attempts = 0;
        await user.save();
    }
}

async function getUserByUserUserName(user_username) {
    try {
        const user = await models.User.findOne({
            where: {
                user_username: user_username
            },
        });

        return user;

    } catch (error) {
        throw new Error(`Error getting user by username: ${error.message}`);
    }
}

async function getUserByUserRole(id_role) {
    try {
        const user = await models.User.findOne({
            where: {
                id_role: id_role
            },
        });

        return user;

    } catch (error) {
        throw new Error(`Error getting user by username: ${error.message}`);
    }
}

async function getUserByIdUser(id_user) {
    try {
        const user = await models.User.findOne({
            where: {
                id_user: id_user
            },
            attributes: ['id_user', 'user_name', 'user_phone', 'user_email', 'user_username', 'number_document', 'postal_code', 'id_state', 'user_profile_photo', 'user_password', 'user_enabled', 'id_role'],

            include: [
                {
                    model: models.UserCreation,
                    as: 'user_created_by',
                    attributes: ['id_user_created_by'],
                }
            ],
        });

        if (user) {
            return user.toJSON();
        } else {
            return null;
        }


    } catch (error) {
        throw new Error(`Error getting user by id: ${error.message}`);
    }
};


async function getAllUsersNotVerified() {
    try {
        const sevenDaysAgo = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
        const users = await models.User.findAll({
            where: {
                user_enabled: false,
                users_created_at: {
                    [models.Sequelize.Op.lt]: sevenDaysAgo
                }
            }
        });
        return users;
    } catch (error) {
        throw new Error(`Error retrieving users: ${error.message}`);
    }
};

async function getUserPassword(id_user) {
    try {
        const user = await models.User.findOne({
            where: {
                id_user: id_user
            },
            attributes: ['user_password'],
        });
        return user;

    } catch (error) {
        throw new Error(`Error getting user by id: ${error.message}`);
    }
};

async function updateUserById(id_user, userData) {
    try {
        const user = await models.User.findByPk(id_user);
        if (!user) {
            throw new Error('User not found');
        }
        if (userData.user_password) {
            const hashedPassword = ecUser.genPasswordSync(userData.user_password);
            userData.user_password = hashedPassword;
        }
        await user.update(userData);
        return user;
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}


async function getAllBusinessman() {
    try {
        const user = await models.User.findAll({
            where: {
                id_role: 2
            },
            attributes: ['id_user', 'user_name', 'user_phone', 'user_email', 'id_user_gender', 'user_username', 'user_profile_photo', 'id_state'],
        });

        return user;

    } catch (error) {
        throw new Error(`Error getting user by id: ${error.message}`);
    }
};

async function getUserByToken(token) {
    try {
        // Implementar lógica para buscar usuario por token
    } catch (error) {
        throw new Error(`Error getting user by token: ${error.message}`);
    }
};

async function updateUser(userData) {
    try {

        if (userData.user_password) {
            const hashedPassword = ecUser.genPasswordSync(userData.user_password);
            userData.user_password = hashedPassword;
        }

        const user = await models.User.findOne({
            where: {
                user_email: userData.user_email
            },
        });

        if (!user) {
            return { error: 'User not found' };
        }

        await user.update(userData);

        const userResult = user.toJSON();
        userResult.user_token = ecUser.genTokenSync(userResult.id_user);
        return user;
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};

async function deleteUser(id) {
    try {
        const user = await models.User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        await user.destroy();
        return true;
    } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
};


//Delete all the users from the user table
async function deleteAllUsers() {
    try {
        // Eliminar los registros de la tabla users_table
        await models.User.destroy({ where: {} });
        console.log('All the users deleted.');
    } catch (error) {
        console.error('Error by deleting users_table:', error);
    }
}


function comparePasswordSync(raw, saved) {
    return ecUser.verifyPasswordSync(raw, saved);
}

async function enableUser(id_user) {
    const userResult = await models.User.update({ user_enabled: true }, { where: { id_user: id_user } });
    return userResult
}


async function updatePassword(id_user, password) {
    try {
        const hashedPassword = ecUser.genPasswordSync(password);
        const user = await models.User.update({ user_password: hashedPassword }, {
            where: {
                id_user: id_user
            }
        });

        return user;

    } catch (error) {
        throw new Error(`Error updating user password: ${error.message}`);
    }
}

async function getUsersPaginated(page) {


    try {
        const result = await models.User.findAndCountAllPaginated(page || 1);
        return result;
    } catch (error) {
        throw new Error(`Error getting users paginated: ${error.message}`);
    }
}

async function getUsersDisabled() {
    try {
        const result = await models.User.findAll({
            where: {
                user_enabled: false,
                users_created_at: {
                    [Op.lt]: new Date(),
                    [Op.gt]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
                }

            },
            attributes: ['id_user'],
        });
        return result;
    } catch (error) {
        throw new Error(`Error getting users disabled: ${error.message}`);
    }
}

async function getUserLearningStyle(id_user) {
    try {
        const user = await models.User.findOne({
            where: {
                id_user: id_user,
            },
            attributes: ['learning_style'],
        });


        if (!user) {
            return "";
        }

        return user;
    } catch (error) {
        throw new Error(`Error getting user course learning_style: ${error.message}`);
    }
}

async function updateUserLearningStyle(id_user, learning_style) {
    try {
        const user = await models.User.findOne({
            where: {
                id_user: id_user,
            },
        });
        if (!user) {
            throw new Error('User course not found');
        }
        await user.update({ learning_style });
        return user;
    } catch (error) {
        throw new Error(`Error updating user course certificate description: ${error.message}`);
    }
}


module.exports = {
    createUser,
    getUserByEmail,
    getUserByToken,
    updateUser,
    deleteUser,
    comparePasswordSync,
    getUserByIdUser,
    deleteAllUsers,
    updateUserCoverPhoto,
    updateUserProfilePhoto,
    getUserByUserUserName,
    getUserByUserRole,
    updateUserById,
    updatePassword,
    getAllBusinessman,
    getUserPassword,
    getUsersPaginated,
    incrementFailedAttempts,
    resetFailedAttempts,
    enableUser,
    getUsersDisabled,
    getAllUsersNotVerified,
    getUserByDocumentNumber,
    getUserLearningStyle,
    updateUserLearningStyle
};