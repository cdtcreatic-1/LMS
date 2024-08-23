const updateUserWithValidData = require('../utils/register_tests_PUT/updateUserWithValidData');
const updateUserWithNewPassword = require('../utils/register_tests_PUT/updateUserWithNewPassword');
const attemptToUpdateNonExistentUser = require('../utils/register_tests_PUT/attemptToUpdateNonExistentUser');
const updateUserCoverPhoto = require('../utils/register_tests_PUT/updateUserCoverPhoto');
const updateUserProfilePhoto = require('../utils/register_tests_PUT/updateUserProfilePhoto');
const userDal = require('cccommon/dal/user');

describe("handler_function for register PUT", () => {
    // Before each test, the database is cleared 
    beforeEach(async () => {
        await userDal.deleteAllUsers();
    });

    it("Update user details with valid data", updateUserWithValidData);
    it("Update user with a new password and ensure it's hashed", updateUserWithNewPassword);
    it("Attempt to update a non-existent user", attemptToUpdateNonExistentUser);
    it("Update user's cover photo", updateUserCoverPhoto);
    it("Update user's profile photo", updateUserProfilePhoto);
});
