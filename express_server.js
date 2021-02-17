const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { use } = require("chai");

app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls : urlDatabase, 
    username : req.cookies["username"]};

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // route to create a new URL, route has to stay above urls/:id
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  // : for url ID, templateVars linked to urls_show
  // const longURL = req.body.longURL;
  const templateVars = { shortURL : req.params.id,
    longURL : urlDatabase[req.params.id], 
    username : req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  // get longURL by the ID of shortURL and redirect to http://..destination
  const specificURL = urlDatabase[req.params.id];  //spfc.url: http://www.google.com
  const shortURL = req.params.id; //9sm5xK
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect("/urls");
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
  console.log('url req body', req.body.longURL)
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
