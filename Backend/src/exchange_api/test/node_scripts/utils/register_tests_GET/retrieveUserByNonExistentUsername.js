const userDal = require('cccommon/dal/user');

async function retrieveUserByNonExistentUsername() {
    const username = "nonexistentuser";
    const user = await userDal.getUserByUserUserName(username);
    expect(user).toBeNull();
}

module.exports = retrieveUserByNonExistentUsername;