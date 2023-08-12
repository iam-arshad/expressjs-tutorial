const express=require("express")
const cookieParser = require('cookie-parser');
const session = require('express-session');
const todosRouter=require("./routes/todos/todos");
const authRouter=require("./routes/auth/auth");
require("./database/index");
const app=express()
const PORT=3000


// Remember that secret keys should remain secret and not be exposed in your codebase, configuration files, or version control. Regularly rotate your secret keys for better security.
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}));

// Middleware to parse cookies
app.use(cookieParser());
app.use(express.json())
app.use("/auth",authRouter);

// Custom Middleware to check whether a user a loggedIn or not
const loggedInMiddleware = function(req, res, next) {
  if (!req.session?.loggedIn) {
    res.status(401).send('You are not logged in');
    return;
  }
    next();// Call next to pass the control to the next middleware
  };
  
// Using the custom middleware
app.use(loggedInMiddleware);


// Mount the todoRouter at '/todos' as a middleware
app.use("/todos",todosRouter);


app.listen(PORT,()=>console.log(`express server running on port ${PORT}`))
