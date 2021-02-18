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

const matchPass = function(firstObj, secondObj) {
  let keyArray = [];
  let pwArray = [];
  for (let match in secondObj) {
    keyArray.push(secondObj[match]);
  }
  for (let item in firstObj) {
    pwArray.push(firstObj[item].password);
    pwArray.push(firstObj[item].email);
  }
  let counter = 0;
  for (let i = 0; i < keyArray.length; i++) {
    for (let j = 0; j < pwArray.length; j++) {
      if (keyArray[i] === pwArray[j]) {
        counter++;
        if (counter === 2) {
          return true;
        }
      }
    }
  }
  return false;
};


module.exports = { checkIfUserExist, matchPass };