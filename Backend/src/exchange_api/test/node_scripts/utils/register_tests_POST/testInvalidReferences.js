const createTestUser = require('./createTestUser');
const dataS = require('../../../../route/register/post');

async function testInvalidReferences() {
    const req = {
        body: {
            ...createTestUser.body,
            id_user_gender: 9999,
            id_type_document: 9999,
            id_state: 9999
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

module.exports = testInvalidReferences;