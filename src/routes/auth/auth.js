const express = require('express');
const {Router} = require('express');
const session = require('express-session');

const router = Router();

// Remember that secret keys should remain secret and not be exposed in your codebase, configuration files, or version control. Regularly rotate your secret keys for better security.
router.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

router.use(express.json())
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || user.password !== password) {
    res.status(401).send('Invalid credentials');
    return;
  }

  // Set a session variable to indicate the user is logged in
  req.session.loggedIn = true;
  req.session.userId = user.id;

  // Store a value in a cookie
  res.cookie('username', user.username);

  res.send('Login successful');
});

router.get('/profile', (req, res) => {
  if (!req.session.loggedIn) {
    res.status(401).send('You are not logged in');
    return;
  }
  const user = users.find(u => u.id === req.session.userId);
  // Retrieve value from the cookie
  const usernameFromCookie = req.cookies.username;
  res.send(`Welcome to your profile, ${user.username}. Your username from cookie: ${usernameFromCookie}`);
});


module.exports=router;