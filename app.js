const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Carinfo = require('./models/carinfo.js');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const userRouter = require("./routes/user.js");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
app.engine('ejs', ejsMate);
const mcq = require("./models/mcq.js");
const mongodb_atlas="mongodb+srv://heramb3112:xYat794RruxmdR4M@cluster0.2bhxsf0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MONGO_URL=mongodb_atlas;

// Middleware setup
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const store =MongoStore.create({
  mongoUrl:MONGO_URL,
  crypto : {
    secret : "mysecretcode",
  },
  touchAfter:24*3600,
});
store.on("error",()=>
{
console.log("error in mongo session store");
});
const sessionOptions = {
  secret: 'mysecretcode',
  store,
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
  await mongoose.connect(MONGO_URL);
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  req.flash('error', 'Something went wrong!');
  res.redirect('/');
});
