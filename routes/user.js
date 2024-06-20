const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const flash = require('connect-flash');
const Carinfo = require("../models/carinfo.js");
const Mcq=require("../models/mcq.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const map_token="pk.eyJ1Ijoic3VyeWEtcmFsbGFwYWxseSIsImEiOiJjbHhqdHNkNDExdjR3MmpzaXcwdHd4ZXBnIn0.SyV1GeMHz8Cx6jeu5HX-qg";
const geocodingClient = mbxGeocoding({ accessToken:map_token });

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
  console.log("post req trial");
  try {
    const newlisting = new Carinfo(info);
    await newlisting.save();
    res.redirect(`/${info.username}/details`);
  } catch (error) {
    req.flash("error", "Error saving car information. Please try again.");
    res.redirect(`/${username}/new`);
  }
});
router.get("/:username/details",async(req,res)=>
{
const person_owner=req.params.username;
console.log(person_owner);
const account_user=await Carinfo.findOne({Owner:person_owner});
res.render("cred/personal_info.ejs",{info:account_user});
});
router.get("/:username/PUC",async(req,res)=>
{
  const person_owner=req.params.username;
  console.log(person_owner);
res.render("cred/edit.ejs",{username:person_owner});
});
router.get("/:username/License_renewal",async(req,res)=>
  {
    const person_owner=req.params.username;
    console.log(person_owner);
  res.render("cred/edit_lic.ejs",{username:person_owner});
  });

router.put("/:username/PUC", async (req, res) => {
  const app_username = req.params.username;
  console.log(app_username);

  try {
    // Retrieve user info
    const app_user_info = await Carinfo.findOne({ Owner: app_username });
    console.log(app_user_info);

    // Calculate new PUC expiry date (extend by 1 year)
    const currentPUCExpiry = app_user_info.Puc_Expiry;
    const newPUCExpiry = new Date(currentPUCExpiry);
    newPUCExpiry.setFullYear(newPUCExpiry.getFullYear() + 1);
    console.log(currentPUCExpiry);
    console.log(newPUCExpiry);
    // Update PUC expiry date
    const updatedUserInfo = await Carinfo.findOneAndUpdate(
      { Owner: app_username },
      { Puc_Expiry: newPUCExpiry }
    );

    req.flash("success", "PUC updated successfully");
    res.redirect(`/${app_username}/details`);
  } catch (error) {
    console.error("Error updating PUC:", error);
    req.flash("error", "Error updating PUC information. Please try again.");
    res.redirect(`/${app_username}/PUC`);
  }
});
router.get("/:username/FindUser",(req,res)=>
{
  const app_user=req.params.username;
res.render("cred/finduser.ejs",{username:app_user});
});
router.post("/:username/FindUser", async (req, res) => {
  try {
    const carPlateNumber = req.body.carPlateNumber;
    console.log("Car Plate Number:", carPlateNumber);

    const app_user = await Carinfo.findOne({ CarPlate: carPlateNumber });
    console.log("App User:", app_user);

    if (app_user && app_user.Owner) {
      console.log(app_user.Owner);
      res.redirect(`/${app_user.Owner}/details`);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:username/License_renewal", async (req, res) => {
  const app_username = req.params.username;
  console.log(app_username);

  try {
    // Retrieve user info
    const app_user_info = await Carinfo.findOne({ Owner: app_username });
    console.log(app_user_info);
    const currentPUCExpiry = app_user_info.License_Expiry;
    const newPUCExpiry = new Date(currentPUCExpiry);
    newPUCExpiry.setFullYear(newPUCExpiry.getFullYear() + 5);
    console.log(currentPUCExpiry);
    console.log(newPUCExpiry);
    // Update PUC expiry date
    const updatedUserInfo = await Carinfo.findOneAndUpdate(
      { Owner: app_username },
      { License_Expiry: newPUCExpiry }
    );

    req.flash("success", "License updated successfully");
    res.redirect(`/${app_username}/details`);
  } catch (error) {
    console.error("Error updating PUC:", error);
    req.flash("error", "Error updating PUC information. Please try again.");
    res.redirect(`/${app_username}/PUC`);
  }
});

router.get("/:username/apply_License", async (req, res) => {
  try {
      const allQuestions = await Mcq.find();
      const correctAnswers = allQuestions.map(question => question.answer); // Assuming 'answer' field in your schema
      const username = req.params.username;

      res.render("personal/exam.ejs", {
          questions: allQuestions,
          correctAnswers: correctAnswers,
          username: username
      });

  } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).send('Internal Server Error');
  }
});
router.post('/:username/apply_License', async (req, res) => {
  const submittedAnswers = req.body.userAnswers;
  const correctAnswers = req.body.answers;
  const username = req.body.username;

  // Logic to check answers
  let score = 0;
  for (let i = 0; i < correctAnswers.length; i++) {
      if (submittedAnswers[i] === correctAnswers[i]) {
          score++;
      }
  }
console.log(score);
if(score>=4)
  {
  const entire_info=await Carinfo.find({Owner:username});
  const city=entire_info[0].address;
  let response=await geocodingClient.forwardGeocode({
      query:city,
      limit:1,
    }).send(); 
  entire_info.geometry=response.body.features[0].geometry;
  console.log(entire_info);
  res.redirect(`/${username}/centre_test`);
  }
  else
  {
    res.send(`username=${username},marks obtained=${score}/${correctAnswers.length}`);
  }

});

router.get("/:username/centre_test",(req,res)=>
{
let user_naav=req.params.username;
console.log(`${user_naav} is qualified`);
res.render("personal/personal_map.ejs");
});


module.exports = router;
