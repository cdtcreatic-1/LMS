const userDal = require('cccommon/dal/user');
const createTestUser = require('../register_tests_POST/createTestUser');
async function retrieveUserByValidEmail() {
    await createTestUser();
    const userEmail = "johndoe@example.com";
    const user = await userDal.getUserByEmail(userEmail);
    expect(user).not.toBeNull();
    expect(user.user_email).toBe(userEmail);
}

module.exports = retrieveUserByValidEmail;