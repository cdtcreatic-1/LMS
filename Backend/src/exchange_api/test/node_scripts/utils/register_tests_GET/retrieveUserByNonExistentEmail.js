const userDal = require('cccommon/dal/user');

async function retrieveUserByNonExistentEmail() {
    const userEmail = "nonexistent@example.com";
    const user = await userDal.getUserByEmail(userEmail);
    expect(user).toBeUndefined();
}

module.exports = retrieveUserByNonExistentEmail;