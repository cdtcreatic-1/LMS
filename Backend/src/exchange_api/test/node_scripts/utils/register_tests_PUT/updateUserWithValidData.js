const createTestUser = require('../register_tests_POST/createTestUser');
const dataPut = require('../../../../route/register/put');
const userDal = require('cccommon/dal/user');

async function updateUserWithValidData() {
    const user = await createTestUser();

    const req = {
        body: {
            id_user: user.id_user,
            user_name: "Updated Name",
            user_phone: "9876543210",
            user_email: "updated@example.com",
            user_username: "updatedusername"
        },
        files: {}
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };
    await dataPut.handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const updatedUser = await userDal.getUserByIdUser(user.id_user);
    expect(updatedUser.user_name).toBe("Updated Name");
    expect(updatedUser.user_phone).toBe("9876543210");
    expect(updatedUser.user_email).toBe("updated@example.com");
    expect(updatedUser.user_username).toBe("updatedusername");
}

module.exports = updateUserWithValidData;