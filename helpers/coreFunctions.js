const bcrypt = require('bcrypt');

const checkIfUserExist = function(database, eml) {
  // returns false to refuse registration and true to accept
  // if the e-mail does not exist in database
  let result = 0;
  for (let user in database) {
    if (database[user].email === eml) {
      result ++;
    }
    if (result > 0) {
      return false;
    }
    return true;
  }
};


const matchPass = function(usersDB, userInfo) {
  // will match the passwords with bcrypt implemented in a priority for safety
  for (let userId in usersDB) {
    if (usersDB[userId].email === userInfo.email) {
      if (bcrypt.compareSync(userInfo.password, usersDB[userId].password)) {
        return userId;
      }
    }
  }
  return false;
};


const matchPassTest = function(usersDB, userInfo) {
  // clone matchPass for testing since bcrypt was hardcoded in to matchTest
  for (let userID in usersDB) {
    if (usersDB[userID].email === userInfo.email) {
      if (usersDB[userID].password === userInfo.password) {
        return userID;
      }
    }
  }
  return false;
};


module.exports = { checkIfUserExist, matchPass, matchPassTest };