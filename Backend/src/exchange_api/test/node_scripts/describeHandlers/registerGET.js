const createTestUser = require('../utils/register_tests_POST/createTestUser');
const getTestUser = require('../utils/register_tests_GET/getTestUser');
const retrieveUserByValidEmail = require('../utils/register_tests_GET/retrieveUserByValidEmail');
const retrieveUserByNonExistentEmail = require('../utils/register_tests_GET/retrieveUserByNonExistentEmail');
const retrieveUserByValidUsername = require('../utils/register_tests_GET/retrieveUserByValidUsername');
const retrieveUserByNonExistentUsername = require('../utils/register_tests_GET/retrieveUserByNonExistentUsername');
const retrieveUserByValidID = require('../utils/register_tests_GET/retrieveUserByValidID');
const retrieveUserByNonExistentID = require('../utils/register_tests_GET/retrieveUserByNonExistentID');
const retrieveUserRoleByValidID = require('../utils/register_tests_GET/retrieveUserRoleByValidID');
const retrieveUserRoleByNonExistentID = require('../utils/register_tests_GET/retrieveUserRoleByNonExistentID');
const userDal = require('cccommon/dal/user');
const farmDal = require('cccommon/dal/farms');
describe("handler_function for register GET", () => {
    // Before each test, the database is cleared 
    beforeEach(async () => {
        await farmDal.deleteAllFarms();
        await userDal.deleteAllUsers();
    });
    it("Retrieve user by valid ID from register endpoint", async () => {
        const createdUser = await createTestUser();  
        await getTestUser(createdUser.id_user);
    });
    it("Retrieve user by non-existent email", retrieveUserByNonExistentEmail);
    it("Retrieve user by non-existent ID", retrieveUserByNonExistentID);
    it("Retrieve user by non-existent username", retrieveUserByNonExistentUsername);
    it("Retrieve user by valid email", retrieveUserByValidEmail);
    it("Retrieve user by valid ID", retrieveUserByValidID);
    it("Retrieve user by valid username", retrieveUserByValidUsername);
    it("Retrieve user role by valid ID", retrieveUserRoleByValidID);
    it("Retrieve user role by non-existent ID", retrieveUserRoleByNonExistentID);
});