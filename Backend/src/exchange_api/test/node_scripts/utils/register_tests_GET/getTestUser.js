const dataGet = require('../../../../route/register/get');

async function getTestUser(id_user) {
    const req = {
        params: {
            id_user: id_user
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
    };

    await dataGet.handler(req, res);

    const responseJson = res.json.mock.calls[0][0];

    expect(res.status).toHaveBeenCalledWith(200);
    expect(responseJson.id_user).toBeDefined();
    expect(responseJson.user_name).toBeDefined();
    expect(responseJson.user_phone).toBeDefined();
    expect(responseJson.user_email).toBeDefined();
    expect(responseJson.user_username).toBeDefined();
    expect(responseJson.number_document).toBeDefined();
    
    if (responseJson.postal_code !== null && responseJson.postal_code !== undefined) {
        expect(typeof responseJson.postal_code).toBe('number');
    }
    if (responseJson.id_state !== null && responseJson.id_state !== undefined) {
        expect(typeof responseJson.id_state).toBe('number');
    }
    if (responseJson.user_profile_photo !== null && responseJson.user_profile_photo !== undefined) {
        expect(typeof responseJson.user_profile_photo).toBe('string');
    }
    if (responseJson.user_country !== null && responseJson.user_country !== undefined) {
        expect(typeof responseJson.user_country).toBe('string');
    }
    if (responseJson.id_country !== null && responseJson.id_country !== undefined) {
        expect(typeof responseJson.id_country).toBe('number');
    }

    return responseJson;
}

module.exports = getTestUser;