const createTestUser = require('../register_tests_POST/createTestUser');
const dataPut = require('../../../../route/register/put');

async function attemptToUpdateNonExistentUser() {
    const user = await createTestUser();
    const req = {
        body: {
            id_user: 9999, 
            user_name: "Ghost User"
        },
        files: {}
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };
    await dataPut.handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400); 
}

module.exports = attemptToUpdateNonExistentUser;