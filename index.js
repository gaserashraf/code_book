const express = require("express");
var mysql = require("mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mysqlConnection = require("./routes/server");
const fs = require("fs");
const app = express();

const problemset = require("./routes/problemset");
const signup = require("./routes/signup");
const articles = require("./routes/articles");
const contests = require("./routes/contests");
const login = require("./routes/login");
const Documentation = require("./routes/Documentation");
const Groups = require("./routes/groups");
const Teams = require("./routes/teams");
const profile = require("./routes/profile");
const logout = require("./routes/logout");
const verify = require("./routes/verifiyToken");
const search = require("./routes/search");
const submission = require("./routes/submission");
const homepage = require("./routes/homepage");
const { resolveInclude } = require("ejs");
const { nextTick } = require("process");
app.set("view engine", "ejs");

app.listen(5000, () => {
  console.log("Server initiated succesfully");
});

// set a static files

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(homepage);
app.use(articles);
app.use(contests);
app.use(problemset);
app.use(login);
app.use(profile);
app.use(signup);
app.use(Documentation);

app.use(logout);
app.use(Groups);
app.use(Teams);
app.use(search);
app.use(submission);

//TO TEST ONLY


// if the request reach to this then there are 404
app.use(verify, (req, res) => {
  let token = req.user;
  res.render("404", { user: req.user, Current_Nav: "__" });
});
