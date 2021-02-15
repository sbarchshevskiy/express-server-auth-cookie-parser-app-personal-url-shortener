const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded(
  {
    extended : true,
  }
));

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls : urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // route to create a new URL, route has to stay above urls/:id
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  // : for url ID, templateVars linked to urls_show
  const templateVars = { shortURL : req.params.shortURL,
    longURL : req.params.longURL,
    newURL : req.params.newURL
  };
  res.render("urls_show", templateVars);
});


app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/hello", (req, res) => {
  res.send("<html><body>Helloooo <b>World</b></body></html>\n");

});

app.post("/urls/new", (req, res) => {
  req.body();
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

const generateRandomString = function() {
  let randomStr = "";
  const alphaNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++)
    randomStr += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
  return randomStr;
};


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
