const dataF = require('../../../../route/register_farm/post');
const createTestUser = require('../register_tests_POST/createTestUser');

async function createFarmWithLatLon() {
    const response = await createTestUser();
    const req = {
        body: {
            id_user: response.id_user,
            farm_name: "Test Farm",
            farm_number_lots: 5,
            farm_longitude: 2.12,
            farm_latitude: 7.12
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
        farmSaved: expect.objectContaining({
            farm_longitude: 2.12,
            farm_latitude: 7.12
        })
    });
    
}

module.exports = createFarmWithLatLon;
