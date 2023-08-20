const express=require("express");
const { Router } = require('express');
const User = require("../../database/schemas/users");
const { hashPassword, comparePassword, setLoggedInUserAndCookie } = require("../../utils/authUtils");
const router = Router();

// to render /register form from ejs template engine
router.get("/register",(req,res)=>{
  // render src/views/auth/register.ejs
  res.render("auth/register");
})


router.use(express.urlencoded({extended:true}));
// POST:http://localhost:3000/auth/register
router.post("/register", async (req, res) => {
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
router.get("/login",(req,res)=>{
  res.render("auth/login");
})


// POST:http://localhost:3000/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).send({ msg: "Incomplete Form: Required fields must be filled." })
  }

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const doPasswordMatches = await comparePassword(password, user.password);
  if (!doPasswordMatches) return res.status(401).json({ error: "Incorrect password" });
  
  // login the user
  setLoggedInUserAndCookie(req, res, user);
  
  // send different types of responses to different clients
  const userAgent = req.get('User-Agent');
  if (userAgent.includes('Postman')) {
    return res.status(200).json({ message: "Login successful" });
  }
  else{
    res.redirect("/");
  }
});


// GET:http://localhost:3000/auth/profile
router.get('/profile', (req, res) => {
  if (!req.session.loggedIn) {
    res.status(401).send('You are not logged in');
    return;
  }
  res.send(`Welcome to your profile, ${req.cookies.username}`);
});


// logout route to clear cookies,session
// GET:http://localhost:3000/auth/logout
router.get("/logout", (req, res) => {
  if (!req.session.loggedIn) {
    res.status(401).send('You are not logged in');
    return;
  }

  req.session.destroy();
  res.clearCookie('username');
  // res.redirect("/login");
  res.send("Good Bye!..")
})

module.exports = router;