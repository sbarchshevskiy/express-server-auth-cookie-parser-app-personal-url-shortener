const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080;
const saltRounds = 10;

const { checkIfUserExist, matchPass } = require("./helpers/coreFunctions");

app.use(express.static("public")); // Static files (css / images)

app.use(cookieSession({
  name: 'session',
  keys: ['7f69fa85-caec-4d9c-acd7-eebdccb368d5', 'f13b4d38-41c4-46d3-9ef6-8836d03cd8eb']
}));


app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.set('view engine', 'ejs');


const urlDatabase = {
  "b2xVn2" : {
    longURL : "http://www.lighthouselabs.ca",
    userId : "userRandomID"
  },
  "9sm5xK": {
    longURL : "http://www.google.com",
    userId: "user2RandomID"
  }
};
console.log(urlDatabase);

const users = {
  "userRandomID": {
    id : "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync('pw2', saltRounds)
  },
  "user2RandomID": {
    id : "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync('pw1', saltRounds)
  }
};

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  // render home page
  const templateVars =
    {
      urls : urlDatabase,
      id : req.session["userId"],
    };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // route to create a new URL, route has to stay above urls/:id
  const templateVars = { shortURL : req.params.id,
    longURL : urlDatabase[req.params.id],
    id : req.session["userId"],
  };
  console.log('new route',urlDatabase);
  res.render("urls_new", templateVars);

});

app.get("/urls/:id", (req, res) => {
  // last minute glitch
  // specific Id doesn't fetch via http response
  // data comes in through backend
  const templateVars = { shortURL : req.params.id,
    urlDatabase : urlDatabase,
    id : req.session["userId"],
    urls : urlDatabase,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  // fetch at specific ID have presented issues while
  // a user would try to modify/edit a shortURL
  // a duplication glitch was however removed
  // data parsed through console is correct

  const shortURL = req.params.id; //9sm5xK
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;


  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars =
    {
      urls : urlDatabase,
      id : req.session["userId"],
    };
  res.render("registration", templateVars);
});

app.post("/register", (req, res) => {
  // implementation of bcrypt hashing
  //as well as creating of a new user object.
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString();

  const newUserObj = {
    id,
    email,
    password: bcrypt.hashSync(password, saltRounds)
  };

  const checkUser = checkIfUserExist(users, email);
  // false response to this = user exists
  if (checkUser) {
    users.id = newUserObj;
    req.session.userId = id;
    res.redirect('/urls');
  } else {
    res.send(console.error(400));
  }
});

app.get("/login", (req, res) => {
  const templateVars =
    {
      urls : urlDatabase,
      id : req.session["userId"],
    };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const userInput = {
    email : req.body.email,
    password: req.body.password};

  const userId = matchPass(users, userInput);

  if (userId) {
    req.session.userId = userId;
    // res.cookie('userId', userId);
    res.redirect("/urls");
  } else {
    res.redirect('/login');
  }
});

app.post("/logout", (req, res) => {
  //log out and deletion of cookies
  //note that re-login or re-register
  //will not work in all cases once cookies are deleted
  req.session = null;
  res.redirect("/login");
});

app.post("/urls/:id/delete", (req, res) => {
  // deletes the URL from db
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  // edits an existing longURL
  const temp = req.body.longURL;
  const shortURL = req.params.id;
  urlDatabase[shortURL]["longURL"] = temp;
  console.log('short url', urlDatabase);
  res.redirect("/urls");

});

app.post("/urls", (req, res) => {
  //creates and posts a NEW shortURL
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userId = req.session.userId;

  urlDatabase[shortURL] = {longURL, userId};

  res.redirect("/urls");
});


const generateRandomString = function() {
  // generates random string of alphanumeric characters
  let randomStr = "";
  const alphaNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++)
    randomStr += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
  return randomStr;
};

app.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}!`);
});
