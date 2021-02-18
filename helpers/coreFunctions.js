const checkIfUserExist = function(db, em) {
  // returns false to refuse registration and true to accept
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


const newUserDBwithUrls = function (userDB, urlDB) {
  //curates a new data base base on shortURL as a main key
  let newDB = {};
  for (let user in userDB)

    for (let url in urlDB) {
      console.log(urlDB)
      newDB = {
        longURL : urlDB[url],
        userID : url
      }
    }
  return newDB;
}


const matchPass = function(usersDB, userInfo) {
  // will match the passwords based on minimum occ. of 2
  for (let userID in usersDB) {
    if (usersDB[userID].email === userInfo.email) {
      if (usersDB[userID].password === userInfo.password) {
        return userID;
      }
    }
  }
  return false;


  // let keyArray = [];
  // let pwArray = [];
  // for (let match in secondObj) {
  //   keyArray.push(secondObj[match]);
  // }
  // for (let item in firstObj) {
  //   pwArray.push(firstObj[item].password);
  //   pwArray.push(firstObj[item].email);
  // }
  // let counter = 0;
  // for (let i = 0; i < keyArray.length; i++) {
  //   for (let j = 0; j < pwArray.length; j++) {
  //     if (keyArray[i] === pwArray[j]) {
  //       counter++;
  //       if (counter === 2) {
  //         return true;
  //       }
  //     }
  //   }
  // }
  // return false;
};


module.exports = { checkIfUserExist, matchPass, newUserDBwithUrls };