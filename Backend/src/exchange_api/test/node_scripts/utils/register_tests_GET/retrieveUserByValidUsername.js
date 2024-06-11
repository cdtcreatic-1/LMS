const userDal = require('cccommon/dal/user');
const createTestUser = require('../register_tests_POST/createTestUser');
const getTestUser = require('../register_tests_GET/getTestUser');
async function retrieveUserByValidUsername() {
    await createTestUser();
    const username = "johndoe";
    const user = await userDal.getUserByUserUserName(username);
    expect(user).not.toBeNull();
    expect(user.user_username).toBe(username);
}

module.exports = retrieveUserByValidUsername;