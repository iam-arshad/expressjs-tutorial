const express = require("express");
const { Router } = require('express');
const User = require("../../database/schemas/users");
const { hashPassword, setLoggedInUserAndCookie } = require("../../utils/authUtils");
const passport = require("passport");
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

  // login the user here...
  setLoggedInUserAndCookie(req, res, newUser);

  return res.status(201).json({ message: "Registration successful" });
});


// to render /login form from ejs template engine
router.get("/login", isAlreadyLoggedIn, (req, res) => {
  res.render("auth/login");
})


// POST:http://localhost:3000/auth/login
router.post('/login', isAlreadyLoggedIn, passport.authenticate("local", { successRedirect: "/todos", failureRedirect: "/auth/login" }));


// GET:http://localhost:3000/auth/profile
router.get('/profile', (req, res) => {
  res.send(`Welcome to your profile, ${req.user}`);
});


// GET:http://localhost:3000/auth/logout
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
})

module.exports = router;