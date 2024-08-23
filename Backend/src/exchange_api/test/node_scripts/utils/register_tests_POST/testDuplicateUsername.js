const createTestUser = require('./createTestUser');
const dataS = require('../../../../route/register/post');

async function testDuplicateUsername() {
    await createTestUser();

    const req = {
        body: {
            ...createTestUser.body,
            user_email: "newemail@example.com"
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

module.exports = testDuplicateUsername;