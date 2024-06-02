const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");  // Correctly require passport at the top

// GET signup route
router.get("/signup", (req, res) => {  
  console.log("get req");
  res.render("../views/users/signup.ejs");
});

// POST signup route
router.post("/signup", async (req, res) => {
  let { username, email, password } = req.body;
  console.log("post req");
  const newUser = new User({ email, username });

  try {
    const registeredUser = await User.register(newUser, password);
    console.log("registration done!");

    req.flash("success", "Login to OneCarStop");
    res.redirect("/login");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
});

// GET login route
router.get("/login", (req, res) => {
  res.render("users/login.ejs", { 
    error: req.flash("error"), 
    success: req.flash("success") 
  });
});

// POST login route
router.post("/login", passport.authenticate("local", { 
  failureRedirect: '/login', failureFlash: true ,
}), async (req, res) => {
  console.log("working");
  req.flash("Welcome to OneStopCar: You are logged in!");
  res.redirect("/");
});

module.exports = router;
