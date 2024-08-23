const createTestUser = require('./createTestUser');
const dataS = require('../../../../route/register/post');
async function testDuplicateEmail() {
    await createTestUser();

    const req = {
        body: {
            ...createTestUser.body,
            user_username: "newusername"
        },
        files: {}
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };
    await dataS.handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
}

module.exports = testDuplicateEmail;