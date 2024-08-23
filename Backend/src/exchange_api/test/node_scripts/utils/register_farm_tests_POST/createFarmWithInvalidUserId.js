const dataF = require('../../../../route/register_farm/post');

async function createFarmWithInvalidUserId() {
    const req = {
        body: {
            id_user: 999999,
            farm_name: "Test Farm",
            farm_number_lots: 5,
            id_village: 1973,
            farm_longitude: 0.0,
            farm_latitude: 0.0
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };
    await dataF.handler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
        code: 'user_not_found',
        details: undefined,
        id: undefined,
        message: 'User not found',
        status: 404
    });
}

module.exports = createFarmWithInvalidUserId;
