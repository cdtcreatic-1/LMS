const createTestUser = require('../register_tests_POST/createTestUser');
const dataPut = require('../../../../route/register/put');
const userDal = require('cccommon/dal/user');

async function updateUserCoverPhoto() {
    const user = await createTestUser();

    const req = {
        body: {
            id_user: user.id_user
        },
        files: {
            user_profile_photo: [{ path: "path/to/new/cover/photo.jpg" }]
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };
    await dataPut.handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const updatedUser = await userDal.getUserByIdUser(user.id_user);
    expect(updatedUser.user_profile_photo).toBe("path/to/new/cover/photo.jpg");
}

module.exports = updateUserCoverPhoto;