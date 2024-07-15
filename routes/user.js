/*const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const flash = require('connect-flash');
const Carinfo = require("../models/carinfo.js");
const Mcq=require("../models/mcq.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const map_token="pk.eyJ1Ijoic3VyeWEtcmFsbGFwYWxseSIsImEiOiJjbHhqdHNkNDExdjR3MmpzaXcwdHd4ZXBnIn0.SyV1GeMHz8Cx6jeu5HX-qg";
const geocodingClient = mbxGeocoding({ accessToken:map_token });
const axios = require('axios');*/
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const flash = require('connect-flash');
const Carinfo = require("../models/carinfo.js");
const Mcq = require("../models/mcq.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const axios = require('axios');
const map_token="pk.eyJ1Ijoic3VyeWEtcmFsbGFwYWxseSIsImEiOiJjbHhqdHNkNDExdjR3MmpzaXcwdHd4ZXBnIn0.SyV1GeMHz8Cx6jeu5HX-qg";
const geocodingClient = mbxGeocoding({ accessToken: map_token });

const locations = [
  [72.8477, 19.0178], [77.2177, 28.6304], [80.2636, 22.5958],
  [80.2341, 13.0418], [78.3489, 17.4401], [77.7500, 12.98],
  [77.4126, 23.2599], [75.8382, 26.9494], [85.12, 25.35], [73.8739, 18.5284],
];

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({ email, username });
  try {
    const registeredUser = await User.register(newUser, password);
    req.flash("success", "Login to OneCarStop");
    return res.redirect("/login");
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", { 
  failureRedirect: '/login', 
  failureFlash: true 
}), (req, res) => {
  req.flash("success", "Welcome to OneStopCar: You are logged in!");
  return res.redirect(`/${req.user.username}`);
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    return res.redirect("/");
  });
});

router.get("/:username", (req, res) => {
  const { username } = req.params;
  res.render("personal/personal.ejs", { username });
});

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
    return res.redirect(`/${username}`);
  } catch (error) {
    req.flash("error", "Error saving car information. Please try again.");
    return res.redirect(`/${username}/new`);
  }
});

router.get("/:username/details", async (req, res) => {
  const person_owner = req.params.username;
  try {
    const account_user = await Carinfo.findOne({ Owner: person_owner });
    res.render("cred/personal_info.ejs", { info: account_user });
  } catch (error) {
    req.flash("error", "Error retrieving car information. Please try again.");
    return res.redirect(`/${person_owner}`);
  }
});

router.get("/:username/PUC", (req, res) => {
  const person_owner = req.params.username;
  res.render("cred/edit.ejs", { username: person_owner });
});

router.get("/:username/License_renewal", (req, res) => {
  const person_owner = req.params.username;
  res.render("cred/edit_lic.ejs", { username: person_owner });
});

router.put("/:username/PUC", async (req, res) => {
  const app_username = req.params.username;
  try {
    const app_user_info = await Carinfo.findOne({ Owner: app_username });
    const currentPUCExpiry = app_user_info.Puc_Expiry;
    const newPUCExpiry = new Date(currentPUCExpiry);
    newPUCExpiry.setFullYear(newPUCExpiry.getFullYear() + 1);

    await Carinfo.findOneAndUpdate(
      { Owner: app_username },
      { Puc_Expiry: newPUCExpiry }
    );

    req.flash("success", "PUC updated successfully");
    return res.redirect(`/${app_username}/details`);
  } catch (error) {
    req.flash("error", "Error updating PUC information. Please try again.");
    return res.redirect(`/${app_username}/PUC`);
  }
});

router.get("/:username/FindUser", (req, res) => {
  const app_user = req.params.username;
  res.render("cred/finduser.ejs", { username: app_user });
});

router.post("/:username/FindUser", async (req, res) => {
  try {
    const carPlateNumber = req.body.carPlateNumber;
    const app_user = await Carinfo.findOne({ CarPlate: carPlateNumber });

    if (app_user && app_user.Owner) {
      return res.redirect(`/${app_user.Owner}/details`);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:username/License_renewal", async (req, res) => {
  const app_username = req.params.username;
  try {
    const app_user_info = await Carinfo.findOne({ Owner: app_username });
    const currentLicenseExpiry = app_user_info.License_Expiry;
    const newLicenseExpiry = new Date(currentLicenseExpiry);
    newLicenseExpiry.setFullYear(newLicenseExpiry.getFullYear() + 5);

    await Carinfo.findOneAndUpdate(
      { Owner: app_username },
      { License_Expiry: newLicenseExpiry }
    );

    req.flash("success", "License updated successfully");
    return res.redirect(`/${app_username}/details`);
  } catch (error) {
    req.flash("error", "Error updating License information. Please try again.");
    return res.redirect(`/${app_username}/License_renewal`);
  }
});

router.get("/:username/apply_License", async (req, res) => {
  try {
    const allQuestions = await Mcq.find();
    const correctAnswers = allQuestions.map(question => question.answer);
    const username = req.params.username;

    res.render("personal/exam.ejs", {
      questions: allQuestions,
      correctAnswers: correctAnswers,
      username: username
    });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.post('/:username/apply_License', async (req, res) => {
  const submittedAnswers = req.body.userAnswers;
  const correctAnswers = req.body.answers;
  const username = req.body.username;

  let score = 0;
  for (let i = 0; i < correctAnswers.length; i++) {
    if (submittedAnswers[i] === correctAnswers[i]) {
      score++;
    }
  }

  if (score >= 4) {
    try {
      const entire_info = await Carinfo.find({ Owner: username });
      const city = entire_info[0].address;
      const response = await geocodingClient.forwardGeocode({
        query: city,
        limit: 1,
      }).send();
      entire_info.geometry = response.body.features[0].geometry;
      return res.redirect(`/${username}/centre_test?city=${city}&geometry=${JSON.stringify(entire_info.geometry)}`);
    } catch (error) {
      return res.status(500).send('Internal Server Error');
    }
  } else {
    return res.send(`Not qualified! Username=${username}, Marks obtained=${score}/${correctAnswers.length}`);
  }
});

router.get("/:username/centre_test", async (req, res) => {
  const username = req.params.username;
  const { city, geometry } = req.query;

  const coordinate = JSON.parse(geometry);
  let mini = 1000000;
  let closestLocation = {};

  for (let i = 0; i < locations.length; i++) {
    const start = coordinate.coordinates;
    const end = locations[i];
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?access_token=${map_token}&geometries=geojson`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data.routes && data.routes.length > 0) {
        const distance = data.routes[0].distance / 1000;
        if (mini > distance) {
          mini = distance;
          closestLocation = { longitude: end[0], latitude: end[1] };
        }
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  }

  res.render("personal/personal_map.ejs", { username, city, longitude: closestLocation.longitude, latitude: closestLocation.latitude });
});

module.exports = router;
