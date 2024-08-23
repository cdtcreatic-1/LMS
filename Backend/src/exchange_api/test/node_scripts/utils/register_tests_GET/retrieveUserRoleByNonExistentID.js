const userRoleDal = require('cccommon/dal/user_role');
async function retrieveUserRoleByNonExistentID() {
    const userId = 9999;
    const user = await userDal.getUserRole(userId);
    expect(user).toBeNull();
}

module.exports = retrieveUserRoleByNonExistentID;