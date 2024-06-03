const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Carinfo = require('./models/carinfo.js');
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const userRouter = require("./routes/user.js");
const ejsMate =require("ejs-mate");

app.engine('ejs',ejsMate);
// Define session options before using them
const sessionOptions = {
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Note: set secure to true if using HTTPS
};
app.use(express.static(path.join(__dirname, "public")));
// Set up views and static files
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

// Use session middleware
app.use(session(sessionOptions));

// Use flash for flash messages
app.use(flash());
app.use(userRouter);

// Initialize passport and use session with passport
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use the user model for authentication
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // To store user info
passport.deserializeUser(User.deserializeUser()); // If user finishes session, logout

// Database connection
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/carStop');
  console.log("DB connected!");
}

main().catch(err => console.log(err));

//starting server 
app.listen(8080, () => {
  console.log("Server listening on port 8080");
});


app.get("/", (req, res) => {
  res.render("home/home.ejs");
});

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta-student"
  });
  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
});

console.log("done");
