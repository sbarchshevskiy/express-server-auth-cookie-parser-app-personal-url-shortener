const bcrypt = require('bcrypt');

const checkIfUserExist = function(database, eml) {
  // returns false to refuse registration and true to accept
  // if the e-mail does not exist in database
  for (let user in database) {
    if (database[user].email === eml) {
      return database[user];
    }
  }
  return false;
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

const savedUrls = function(urlDB, id) {
  // fetch proper url data for the registered users
  let urls = {};
  console.log('id',id);
  for (let shortURL in urlDB) {
    if (urlDB[shortURL]["userId"] === id) {
      urls[shortURL] = {longURL : urlDB[shortURL]["longURL"], id};
    }
  }
  return urls;
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


module.exports = { checkIfUserExist, matchPass, matchPassTest, savedUrls };