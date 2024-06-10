const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Carinfo = require('./models/carinfo.js');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const userRouter = require("./routes/user.js");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
app.engine('ejs', ejsMate);

// Middleware setup
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const sessionOptions = {
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
};

app.use(session(sessionOptions));
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash message middleware
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Passport Local Strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use('/', userRouter);

// Database connection
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/carStop');
  console.log("DB connected!");
}

main().catch(err => console.log(err));

// Start the server
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  req.flash('error', 'Something went wrong!');
  res.redirect('/');
});
