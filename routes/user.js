const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");  // Correctly require passport at the top
const Carinfo=require("../models/carinfo.js");
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
  console.log(req.user.username);
  req.flash("Welcome to OneStopCar: You are logged in!");
  res.redirect(`/${req.user.username}`);
});

/*router.get("/:username", (req, res) => {
  const username = req.params.username;
  const flashMessage = "Welcome, You have logged in.";
  res.render("personal/personal.ejs", { username: username, flashMessage: flashMessage });
});*/

// Display route
router.get("/display", async (req, res) => {
  try {
    const allUsers = await Carinfo.find({});
    console.log(allUsers); // Debugging line to check the data
    res.render("cred/display.ejs", { allUsers });
  } catch (error) {
    console.error("Error fetching data from the database: ", error);
    req.flash("error", "Error displaying users. Please try again later.");
    res.redirect("/error");  // Ensure this route exists or handle it appropriately
  }
});



module.exports = router;

