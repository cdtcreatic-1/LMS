const userDal = require('cccommon/dal/user');
const userCreationDal = require('cccommon/dal/user_creation');
const userLoginDal = require('cccommon/dal/login_attempts');
const ecUser = require('cccommon/user');
var cron = require('node-cron');

exports.cleanDisabledUsers = () => {
    cron.schedule('0 0 * * 0', async () => {
        try {
            const users = await userDal.getAllUsersNotVerified();

            if (!users || users.length === 0) {
                console.log('No unverified users to delete.');
                return;
            }

            for (const user of users) {
                try {
                    const userCreationDeleted = await userCreationDal.deleteUserCreation(user.id_user);
                    const loginAttemptsDeleted = await userLoginDal.deleteLoginAttempts(user.id_user);
                    const userDeleted = await userDal.deleteUser(user.id_user);

                    if (!userCreationDeleted || !loginAttemptsDeleted || !userDeleted) {
                        console.error(`Failed to delete user with ID ${user.id_user}`);
                    }
                } catch (err) {
                    console.error(`Error processing user with ID ${user.id_user}: ${err}`);
                }
            }

            console.log("Unverified users deleted successfully");
        } catch (error) {
            console.error('Error retrieving and deleting unverified users:', error);
        }
    });
};
