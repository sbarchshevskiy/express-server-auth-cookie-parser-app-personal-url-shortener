
const checkIfUserExist = function(db, em) {
  // returs false to refuse registration and true to accept
  let result = 0;
  for (let item in db) {
    if (db[item].email === em) {
      result ++;
    }
    if (result > 0) {
      return false;
    }
    return true;
  }
};


module.exports = checkIfUserExist;