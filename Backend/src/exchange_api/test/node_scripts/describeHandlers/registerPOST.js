const createTestUser = require('../utils/register_tests_POST/createTestUser');
const testDuplicateEmail = require('../utils/register_tests_POST/testDuplicateEmail');
const testDuplicateUsername = require('../utils/register_tests_POST/testDuplicateUsername');
const testMissingRequiredFields = require('../utils/register_tests_POST/testMissingRequiredFields');
const testInvalidReferences = require('../utils/register_tests_POST/testInvalidReferences');
const userDal = require('cccommon/dal/user');
const farmDal = require('cccommon/dal/farms');

describe("handler_function for register POST", () => {
    // Before each test, the database is cleared 
    beforeEach(async () => {
        await farmDal.deleteAllFarms();
        await userDal.deleteAllUsers();
    });

    it("test_user_created_successfully for farmer with all parameters", createTestUser);
    it("test_duplicate_email", testDuplicateEmail);
    it("test_duplicate_username", testDuplicateUsername);
    it("test_missing_required_fields", testMissingRequiredFields);
    it("test_invalid_references", testInvalidReferences);
});