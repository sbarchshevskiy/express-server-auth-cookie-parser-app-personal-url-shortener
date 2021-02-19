const { assert } = require('chai');
const { matchPassTest, checkIfUserExist } = require('../helpers/coreFunctions');


const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
//ignoring that email is an actual email
describe('checkIfUserExist', function() {
  it('will not allow existing user to register', function() {
    const userEmail = "user@example.com";

    const doesUserExist = checkIfUserExist(testUsers, userEmail);
    assert.isFalse(doesUserExist);

  });

  it('will return true and accept user email if did not exist in database', function() {
    const newUserEmail = "newuser@example.com";

    const isThisANewUser = checkIfUserExist(testUsers, newUserEmail);
    assert.isTrue(isThisANewUser);
  });

  it('should return true if a userId is resulted from a password and email match', function() {
    const sampleId = "userRandomID";
    const userEntryObject = { email : "user@example.com", password : "purple-monkey-dinosaur" };

    const isValidUserPassword = matchPassTest(testUsers, userEntryObject);
    assert.isTrue(isValidUserPassword === sampleId);
  });

  it('will return false if userId is not listed with password and email config', function () {
    const sampleWrongId = "nonexistant";
    const userEntryObject = { email : "user@example.com", password : "purple-monkey-dinosaur" };

    const isValidUserPassword = matchPassTest(testUsers, userEntryObject);
    assert.isFalse(isValidUserPassword === sampleWrongId);

  });

  it('will reject password and return false as a result if password is wrong despite userId and email listed', function() {
    const userId = "userRandomID";
    const userEntryObject = { email : "user@example.com", password : "purple-unicorn-dinosaur" };

    const isValidUserPassword = matchPassTest(testUsers, userEntryObject);
    assert.isFalse(isValidUserPassword === userId);
  });

  it('will return false if a wrong email was entered through login route', function() {
    const emailCheckPoint = { email : "lol@lol.lol", password : "purple-monkey-dinosaur" };

    const isValidUserPassword = matchPassTest(testUsers, emailCheckPoint);
    assert.isFalse(isValidUserPassword);
  });
});