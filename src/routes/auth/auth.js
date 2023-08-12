const {Router} = require('express');
const User=require("../../database/schemas/users");

const router = Router();

router.post("/register",async (req,res)=>{
  const {username,password}=req.body;
  // console.log("/auth/register",username);

  const userDB= await User.findOne({username:username});
  if(userDB)
  {
    res.status(400).send({msg:"user already exists"})
  }
  else{
    // for now we will store the raw password and in later sections we will store the hashed password In sha Allah 📚
    const newUser= await User.create({username,password})
    // console.log(newUser)
    // login the user here...
    res.status(201).send("Registered Successfully");
  }
})


// In the next few chapters, this will be handled using a DB In sha Allah😊
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

// POST:http://localhost:3000/auth/login
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

  // Store a value in a cookie(insensitive data in cookies)
  res.cookie('username', user.username);

  res.send('Login successful');
});

// GET:http://localhost:3000/auth/profile
router.get('/profile', (req, res) => {
  if (!req.session.loggedIn) {
    res.status(401).send('You are not logged in');
    return;
  }
  const user = users.find(u => u.id === req.session.userId);
  const usernameFromCookie = req.cookies.username;
  res.send(`Welcome to your profile, ${user.username}. Your username from cookie: ${usernameFromCookie}`);
});


// logout route to clear cookies,session
// GET:http://localhost:3000/auth/logout
router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.clearCookie('username');
    // res.redirect("/login");
    res.send("Good Bye!..")
})

module.exports=router;