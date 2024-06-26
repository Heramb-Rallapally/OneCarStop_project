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
const axios = require('axios');
const locations=
[ //Mumbai-->Dadar
  
  [ 72.8477,19.0178],
  //Delhi-->connauaght plac
  [  77.2177,28.6304],
  
  [80.2636,22.5958],
  //chennai-->T nagar
  
  [80.2341,13.0418],
  //GachBowli-->Hyderabad
  [78.3489,17,4401],
  //whiteField-->Banglore
  [77.7500,12.98],
  //bhopal
  [77.4126,23.2599],
  //jaipur
  [75.8382,26.9494],
  //patna
  [85.12,25.35],
  //pune
  [73.8739,18.5284],
];

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
  console.log(entire_info[0]);
  const city=entire_info[0].address;
  let response=await geocodingClient.forwardGeocode({
      query:city,
      limit:1,
    }).send(); 
  entire_info.geometry=response.body.features[0].geometry;
  console.log(entire_info);
  res.redirect(`/${username}/centre_test?city=${city}&geometry=${JSON.stringify(entire_info.geometry)}`);
  }
  else
  {
    res.send(`username=${username},marks obtained=${score}/${correctAnswers.length}`);
  }

});

router.get("/:username/centre_test", async (req, res) => {
  const username = req.params.username;
  const { city, geometry } = req.query;

  console.log(`${username} is qualified`);
  console.log(`City: ${city}`);
  const coordinate = JSON.parse(geometry);let mini=1000000;let minx=0;let miny=0;
  for(let i=0;i<locations.length;i++)
    {
  const start = coordinate.coordinates;
  const end = locations[i]; // Assuming you want to calculate distance to Kolkata
  console.log('Start coordinates:', start);
  console.log('End coordinates:', end);

  const map_token = "pk.eyJ1Ijoic3VyeWEtcmFsbGFwYWxseSIsImEiOiJjbHhqdHNkNDExdjR3MmpzaXcwdHd4ZXBnIn0.SyV1GeMHz8Cx6jeu5HX-qg";
  
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?access_token=${map_token}&geometries=geojson`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.routes && data.routes.length > 0) {
      const distance = data.routes[0].distance / 1000; // Convert to kilometers
      if(mini>distance)
        {
          mini=distance;x=end[0];y=end[1];
        }
      console.log(`Distance: ${distance} Kilometers`);
    } else {
      console.log('No routes found');
    }
  } catch (error) {
    console.error('Error fetching directions:', error);
  }
}
   res.render("personal/personal_map.ejs", { username, city, longitude: x, latitude: y });
});

module.exports = router;