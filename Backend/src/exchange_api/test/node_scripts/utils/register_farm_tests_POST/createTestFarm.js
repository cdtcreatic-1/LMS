const dataF = require('../../../../route/register_farm/post');
const createTestUser = require('../register_tests_POST/createTestUser');

async function createTestFarm() {
    response = await createTestUser();
    console.log(response);
    const req = {
        body: {
            id_user: response.id_user,
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
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
        message: 'User created successfully',
        farmSaved: expect.any(Object)
    });
}

module.exports = createTestFarm;