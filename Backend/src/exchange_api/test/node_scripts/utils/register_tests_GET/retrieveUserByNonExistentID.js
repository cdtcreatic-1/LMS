const userDal = require('cccommon/dal/user');

async function retrieveUserByNonExistentID() {
    const userId = 9999;
    const user = await userDal.getUserByIdUser(userId);
    expect(user).toBeNull();
}

module.exports = retrieveUserByNonExistentID;