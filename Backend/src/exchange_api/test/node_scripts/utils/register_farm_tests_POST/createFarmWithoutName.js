const dataF = require('../../../../route/register_farm/post');
const createTestUser = require('../register_tests_POST/createTestUser');

async function createFarmWithoutName() {
    response = await createTestUser();
    console.log(response);
    const req = {
        body: {
            id_user: response.id_user,
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
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
        message: 'One or more input fields was not accepted.',
        details: { farm_name: 'missing' },
        code: 'validation_error',
        id: undefined,
        status: 400
    });
}

module.exports = createFarmWithoutName;
