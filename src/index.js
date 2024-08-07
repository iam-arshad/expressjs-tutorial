const express=require("express")
const passport = require("passport");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv= require("dotenv");
const flash=require("connect-flash");
const todosRouter=require("./routes/todos/todos");
const authRouter=require("./routes/auth/auth");
require("./database/index");
require("./strategies/local");


dotenv.config(); //load env variables before executing the google oauth2 functionality
require("./strategies/googleOAuth2");


const app=express()
const PORT=3000

// set the template engine and the directory for forms
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


// Remember that secret keys should remain secret and not be exposed in your codebase, configuration files, or version control. Regularly rotate your secret keys for better security.
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 10*60*1000 }
}));

app.use(passport.initialize())
app.use(passport.session())

// Middleware to parse cookies
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(flash());
app.use("/auth",authRouter);

// home page route using ejs template engine to view from a browser
// http://localhost/3000
app.get("/", (req, res) => {
  let username = req.user?.username;

  let flashMessage = req.flash('success');

  // to disable caching, you can instruct the browser to fetch the resource from the server every time.
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  // if not cached, we will get 304 Not Modified status code instead of 200 OK, which will fail testcases
  
  // passing username to the ejs view file
  res.status(200).render("index", { username:username, success: flashMessage.length > 0 ? flashMessage : null });
});


// Custom Middleware to check whether a user a loggedIn or not
const loggedInMiddleware = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else return res.redirect("/auth/login");
}
app.use(loggedInMiddleware);


// Mount the todoRouter at '/todos' as a middleware
app.use("/todos",todosRouter);

// to serve static files
app.use(express.static("public"));

// err parameter is the newly added parameter from the previous middleware(by next(errorMessage))
function errorHandler(err, req, res, next) {
  // console.error(err);
  res.status(err.status || 500);
  res.json({error: { message: err.message || 'Internal Server Error'}});
}
app.use(errorHandler);

app.listen(PORT,()=>console.log(`express server running on port ${PORT}`))


module.exports= app;