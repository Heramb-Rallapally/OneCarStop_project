const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const flash = require('connect-flash');
const Carinfo = require("../models/carinfo.js");

// GET signup route
router.get("/signup", (req, res) => {  
  res.render("users/signup.ejs");
});

// POST signup route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({ email, username });

  try {
    const registeredUser = await User.register(newUser, password);
    req.flash("success", "Login to OneCarStop");
    res.redirect("/login");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
});

// GET login route
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// POST login route
router.post("/login", passport.authenticate("local", { 
  failureRedirect: '/login', 
  failureFlash: true 
}), (req, res) => {
  console.log("came to login flash");
  req.flash("success", "Welcome to OneStopCar: You are logged in!");
  res.redirect(`/${req.user.username}`);
});

// GET logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/");
  });
});

// User-specific route
router.get("/:username", (req, res) => {
  const { username } = req.params;
  res.render("personal/personal.ejs", { username });
});

// Create new car listing route
router.get("/:username/new", (req, res) => {
  const { username } = req.params;
  res.render("cred/create.ejs", { username });
});

router.post("/:username", async (req, res) => {
  const { username } = req.params;
  const info = req.body.info;

  try {
    const newlisting = new Carinfo(info);
    await newlisting.save();
    res.redirect(`/${username}`);
  } catch (error) {
    req.flash("error", "Error saving car information. Please try again.");
    res.redirect(`/${username}/new`);
  }
});

module.exports = router;
