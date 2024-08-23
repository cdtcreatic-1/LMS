const dataF = require('../../../../route/register_farm/post');
const createTestUser = require('../register_tests_POST/createTestUser');

async function createFarmWithInvalidVillageId() {
    const response = await createTestUser();
    const req = {
        body: {
            id_user: response.id_user,
            farm_name: "Test Farm",
            farm_number_lots: 5,
            id_village: 0,
        }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
    };
    await dataF.handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
        code: "validation_error",
        details: {
            farm_latitude: "missing",
            farm_longitude: "missing",
            id_village: "missing",
        },
        id: undefined,
        message: "One or more input fields was not accepted.",
        status: 400,
    });
}

module.exports = createFarmWithInvalidVillageId;
