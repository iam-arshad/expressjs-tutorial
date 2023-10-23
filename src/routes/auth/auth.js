const express = require("express");
const { Router } = require('express');
const User = require("../../database/schemas/users");
const { hashPassword, setLoggedInUserAndCookie } = require("../../utils/authUtils");
const passport = require("passport");
const jwt = require("jsonwebtoken")
const router = Router();

// prevent user from get,post methods of register,login(but not profile,logout) routes if already logged in
const isAlreadyLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/")
  }
  else {
    next();
  }
}

// to render /register form from ejs template engine
router.get("/register", isAlreadyLoggedIn, (req, res) => {
  // render src/views/auth/register.ejs
  res.render("auth/register");
})


// POST:http://localhost:3000/auth/register
router.post("/register", isAlreadyLoggedIn, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Incomplete Form: Required fields must be filled." });
  }

  const userDB = await User.findOne({ username });
  if (userDB) {
    return res.status(409).json({ error: "User already exists" });
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({ username, password: hashedPassword });

  // login the user here(by passport.js's req.login())...
  req.login(newUser, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }
    return res.redirect('/'); // Redirect to home page indicating successful registration and login
  });
});


// to render /login form from ejs template engine
router.get("/login", isAlreadyLoggedIn, (req, res) => {
  res.render("auth/login");
})


// POST:http://localhost:3000/auth/login
router.post('/login', isAlreadyLoggedIn, passport.authenticate("local", { failureRedirect: "/auth/login" }), (req, res) => {
  // User authenticated, generate a JWT
  const user = req.user; // Assuming you have the user object in the request
  const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  res.json({ token: accessToken });
});

// google oauth2 authentication route
router.get("/google", passport.authenticate("google", { scope: ['profile', 'email'] }))

// Google OAuth 2.0 callback URL
router.get('/api/google/redirect', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Successful authentication, redirect to a different route or respond as needed.
  // console.log(req.user);
  res.redirect('/auth/profile');
});

// middleware to verify the accessToken
function verifyToken(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send("You're not logged in")
  }

  // 'Bearer eyJhzVCJ9.eyJpZCI6IjY1M.CkuDkZYapgF'
  const accessToken = req.headers["authorization"].split(" ")[1];
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) {
      return res.status(401).json({ msg: "invalid token" }); //Unauthorized
    }
    // passport's local strategy will set the user's data in request object by default after logging in
    // so, i am not utilizing the data(id,username,...) present in jwt here.
    next();
  })
}

// GET:http://localhost:3000/auth/profile
router.get('/profile', verifyToken, (req, res) => {
  res.send(`Welcome to your profile, ${req.user.username}`);
});


// GET:http://localhost:3000/auth/logout
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash('success', 'logged out successfully!');
    res.redirect('/');
  });
})

module.exports = router;