const dataS = require('../../../../route/register/post');

async function testMissingRequiredFields() {
    const req = {
        body: {},
        files: {}
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };
    await dataS.handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
}

module.exports = testMissingRequiredFields;