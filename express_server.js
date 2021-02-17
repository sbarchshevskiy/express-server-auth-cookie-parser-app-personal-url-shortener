const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { use } = require("chai");
const { resolveInclude } = require("ejs");

app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id : "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id : "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls : urlDatabase,
    email : req.cookies["email"]};

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // route to create a new URL, route has to stay above urls/:id
  const templateVars = { shortURL : req.params.id,
    longURL : urlDatabase[req.params.id],
    email : req.cookies["email"]
  };
  res.render("urls_new", templateVars);

});

app.get("/urls/:id", (req, res) => {
  // : for url ID, templateVars linked to urls_show
  // const longURL = req.body.longURL;
  const templateVars = { shortURL : req.params.id,
    longURL : urlDatabase[req.params.id],
    email : req.cookies["email"]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  // get longURL by the ID of shortURL and redirect to http://..destination
  // const specificURL = urlDatabase[req.params.id];  //spfc.url: http://www.google.com
  const shortURL = req.params.id; //9sm5xK
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = { urls : urlDatabase,
    email : req.cookies["email"]};
  res.render("registration", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  // const password = req.body.password;

  const newUserObj = {
    email,
    email,
    password
  };

  // const registeredUser = userDatabase[email];
  // if (registeredUser){

  // }

  res.cookie('email', email);
  res.redirect("login");
});

app.get("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const loggedUser = users[email];
  if (loggedUser) {
    if (loggedUser.password === password) {
      res.cookie('email', email);
      res.redirect('/urls');
    } else {
      res.redirect("/register");
    }
  }

  const templateVars = { urls : urlDatabase,
    email : req.cookies["email"]};
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  // const password = req.body.password;

  res.cookie('email', email);

  res.redirect("/urls");

});

app.post("/logout", (req, res) => {
  res.clearCookie("email");
  res.redirect("/login");
});

app.post("/urls/:id/delete", (req, res) => {
  // deletes the URL from db
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  // edits an eixiting longURL
  const temp = req.body.longURL;
  const shortURL = req.params.id;
  urlDatabase[shortURL] = temp;
  res.redirect("/urls");

});

app.post("/urls", (req, res) => {
  //creates and posts a NEW shortURL
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  console.log('url req body', req.body.longURL);
  urlDatabase[shortURL] = longURL;
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
