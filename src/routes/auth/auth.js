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

// homepage to register/login
router.get('/', isAlreadyLoggedIn, (req, res) => {
  res.render("auth/auth");
})

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
router.post('/login', isAlreadyLoggedIn, passport.authenticate("local", { failureRedirect: "/auth/login" }), async (req, res) => {
  // User authenticated, generate a JWT
  const user = req.user; // user object will be in the request object when passport local is used
  const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 30 });
  const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.REFRESH_TOKEN_SECRET);

  //updating the refreshToken in the db
  await User.findOneAndUpdate({ username: user.username }, { $push: { refreshTokens: refreshToken } });
  if (req.isPostman) {
    return res.status(200).json({ accessToken, refreshToken });
  }
  if (req.isBrowser) {
    return res.redirect('/');
  }

  // if none of the above clients
  return res.status(200).json({ accessToken, refreshToken });
});

router.post("/token", async (req, res) => {
  const { refreshToken } = req.body;
  const user = await User.findOne({ 'refreshTokens': refreshToken })

  // if refresh token not found for any of the users
  if (!user) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  // verify the refreshToken is valid or not
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err) {
      res.sendStatus(403);
    }
    const accessToken = jwt.sign({ username: data.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 50 })
    res.json({ accessToken });
  })
})

// google oauth2 authentication route
router.get("/google", passport.authenticate("google", { scope: ['profile', 'email'] }))

// Google OAuth 2.0 callback URL
router.get('/api/google/redirect', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Successful authentication, redirect to a different route or respond as needed.
  // console.log(req.user);
  res.redirect('/');
});

// middleware to verify the accessToken
function verifyToken(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send("You're not logged in")
  }

  if (req.isPostman) {
    // 'Bearer eyJhzVCJ9.eyJpZCI6IjY1M.CkuDkZYapgF'
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) {
        return res.status(401).json({ msg: "invalid token" }); //Unauthorized
      }
    })
  }
  next();
}

// GET:http://localhost:3000/auth/profile
router.get('/profile', verifyToken, (req, res) => {
  res.status(200).send(`Welcome to your profile, ${req.user.username}`);
});


// GET:http://localhost:3000/auth/logout
router.get("/logout", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.send("You didn't loggedin to logoff!").end();
  }
  else {
    try {
      await User.findOneAndUpdate({ username: req.user.username }, { $set: { refreshTokens: [] } }); //empty the refreshTokens array
      req.logout(function (err) {
        if (err) return next(err);
        req.flash('success', 'logged out successfully!');
        res.redirect('/');
      });
    }
    catch (e) {
      return next(e);
    }
  }
})

module.exports = router;