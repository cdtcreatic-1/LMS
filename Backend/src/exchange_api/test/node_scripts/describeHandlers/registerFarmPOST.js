const userDal = require('cccommon/dal/user');
const farmDal = require('cccommon/dal/farms');
const createFarmWithoutName = require('../utils/register_farm_tests_POST/createFarmWithoutName');
const createFarmWithInvalidUserId = require('../utils/register_farm_tests_POST/createFarmWithInvalidUserId');
const createFarmWithInvalidVillageId = require('../utils/register_farm_tests_POST/createFarmWithInvalidVillageId');
const createFarmWithoutLatLon = require('../utils/register_farm_tests_POST/createFarmWithoutLatLon');
const createFarmWithLatLon = require('../utils/register_farm_tests_POST/createFarmWithLatLon');

const createTestFarm = require('../utils/register_farm_tests_POST/createTestFarm');

describe('handler_function', () => { 
    // Before each test, the database is cleared
    beforeEach(async () => {
        await farmDal.deleteAllFarms();
        console.log("01 Farms deleted");
        await userDal.deleteAllUsers();
        console.log("02 Users deleted");
    });
    // Tests that the function returns a success message and the farmSaved object when all required fields are present and valid. 
    it("test_create_farm_success", createTestFarm);
    it("test_create_farm_without_name", createFarmWithoutName);
    it("test_create_farm_without_name", createFarmWithInvalidUserId);
    it("test_create_farm_without_name", createFarmWithInvalidVillageId);
    it("test_create_farm_without_name", createFarmWithoutLatLon);
    it("test_create_farm_without_name", createFarmWithLatLon);
});