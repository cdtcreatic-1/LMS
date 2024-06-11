const createTestUser = require('../register_tests_POST/createTestUser');
const dataPut = require('../../../../route/register/put');
const userDal = require('cccommon/dal/user');

async function updateUserWithNewPassword() {
    const user = await createTestUser();
    const newPassword = 'newpassword123';

    const req = {
        body: {
            id_user: user.id_user,
            user_password: newPassword,
            user_confirm_password: newPassword
        },
        files: {}
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };
    await dataPut.handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);    
    const updatedUser = await userDal.getUserPassword(user.id_user);
    expect(userDal.comparePasswordSync(newPassword, updatedUser.dataValues.user_password)).toBe(false);
}

module.exports = updateUserWithNewPassword;