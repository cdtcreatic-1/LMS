const userDal = require('cccommon/dal/user');
const createTestUser = require('../register_tests_POST/createTestUser');
async function retrieveUserByValidID() {
    const responseJson = await createTestUser();
    const userId = responseJson.id_user;
    const user = await userDal.getUserByIdUser(userId);
    expect(user).not.toBeNull();
    expect(user.id_user).toBe(userId);
}

module.exports = retrieveUserByValidID;