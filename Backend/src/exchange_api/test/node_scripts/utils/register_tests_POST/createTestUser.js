const dataS = require('../../../../route/register/post');

async function createTestUser() {
    const req = {
        body: {
            user_name: "John Doe",
            user_phone: "1234567890",
            user_email: "johndoe@example.com",
            user_password: "password",
            user_confirm_password: "password", 
            user_username: "johndoe",
            id_user_gender: 1,
            id_type_document: 1,
            number_document: "1234567890",
            id_role: 1
        },
        files: {}
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };
    await dataS.handler(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
        id_user: expect.any(Number),
        token: expect.any(String),
        fex_version: expect.any(String)
    });
    const responseJson = res.send.mock.calls[0][0];
    return responseJson;
}

module.exports = createTestUser;