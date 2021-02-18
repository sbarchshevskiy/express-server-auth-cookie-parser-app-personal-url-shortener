const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
// const bcrypt = require('bcrypt');
// const password = "secret"; // found in the req.params object
// const hashedPassword = bcrypt.hashSync(password, 10);
const { checkIfUserExist, matchPass, newUserDBwithUrls } = require("./helpers/coreFunctions");
app.use(express.static("public"));


// const { use } = require("chai");
// const { resolveInclude } = require("ejs");

app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.set('view engine', 'ejs');


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const urlDatabase2 = {
  "b2xVn2" : {
    longURL : "http://www.lighthouselabs.ca",
    userId : "userRandomID"
  },
  "9sm5xK": {
    longURL : "http://www.google.com",
    userId: "user2RandomID"
  }
};

const users = {
  "userRandomID": {
    id : "userRandomID",
    email: "user@example.com",
    password: "pw"
  },
  "user2RandomID": {
    id : "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// const urlDatabase2 = newUserDBwithUrls(users, urlDatabase);


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  // render home page
  const templateVars =
    {
      urls : urlDatabase2,
      email : req.cookies["user_id"],
    };
  console.log('urls index long url: ' , templateVars)
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // route to create a new URL, route has to stay above urls/:id
  const templateVars = { shortURL : req.params.id,
    longURL : urlDatabase[req.params.id],
    email : req.cookies["user_id"],
  };
  console.log('template vars',templateVars);
  res.render("urls_new", templateVars);

});

app.get("/urls/:id", (req, res) => {

  const templateVars = { shortURL : req.params.id,
    longURL : urlDatabase[req.params.id],
    email : req.cookies["user_id"],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {

  const shortURL = req.params.id; //9sm5xK
  const longURL = req.body.longURL;
  console.log('id long url: ',longURL);

  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars =
    {
      urls : urlDatabase,
      email : req.cookies["user_id"],
    };
  res.render("registration", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString();

  //------------------------------
  //testing URLdb2
  const longURLDB2 =req.body.longURL;
  const idDB2 = generateRandomString();
  const shortURL = req.params.shortURL

  const newDBObject = {
    id2 : idDB2,
    longURLDB2,
    shortURL

  }
  urlDatabase2[idDB2] = newDBObject;
  console.log('new db object', newDBObject)


  //------------------------------

  const newUserObj = {
    id,
    email,
    password
  };

  const checkUser = checkIfUserExist(users, email);
  //if it doesn't return true (user exists)
  if (checkUser) {
    users.id = newUserObj;
    res.cookie('user_id', id);
    res.redirect('/urls');
  } else {
    res.send(console.error(400));
  }
});

app.get("/login", (req, res) => {
  const templateVars =
    {
      urls : urlDatabase,
      email : req.cookies["user_id"],
    };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userInput = {email, password};

  const userId = matchPass(users, userInput);

  if (userId) {
    res.cookie('user_id', userId);
    res.redirect("/urls");
    console.log('match!');
  } else {
    console.log('not match');
    res.redirect('/login');
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
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
  urlDatabase[shortURL] = temp;
  res.redirect("/urls");

});

app.post("/urls", (req, res) => {
  //creates and posts a NEW shortURL
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const userId = req.cookies["user_id"];

  const short = users["id"];
  console.log('short', short);
  console.log('user ID', userId);
  console.log('long url', longURL);
  // urlDatabase[shortURL] = longURL;
  urlDatabase2[shortURL] = {longURL, userId};

  console.log('urldb2',urlDatabase2);
  console.log('urlsdb2 short URL', urlDatabase[shortURL])
  res.redirect("/urls");
});


const generateRandomString = function() {
  // 5 random char string generator for shortURL
  let randomStr = "";
  const alphaNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++)
    randomStr += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
  return randomStr;
};


app.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}!`);
});
