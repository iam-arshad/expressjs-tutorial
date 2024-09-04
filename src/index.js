const express=require("express")
const expressLayouts = require('express-ejs-layouts')
const passport = require("passport");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv= require("dotenv");
dotenv.config(); //load env variables before executing the google oauth2 functionality
const flash=require("connect-flash");
const todosRouter=require("./routes/todos/todos");
const authRouter=require("./routes/auth/auth");
require("./database/index");
require("./strategies/local");
const Todo=require('./database/schemas/todos');

require("./strategies/googleOAuth2");


const app=express()
const PORT=3000

// set the template engine and the directory for forms
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(expressLayouts)
app.set('layout', './layouts/sample-layout')

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

// to serve static files
app.use(express.static("public"));

// middleware to find the client(typically browser||postman)
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'];
  req.isPostman = userAgent && userAgent.includes('Postman');
  req.isBrowser = userAgent && !req.isPostman;
  next();
});

app.use("/auth",authRouter);

// home page route using ejs template engine to view from a browser
// http://localhost/3000
app.get("/",async (req, res) => {

  let flashMessage = req.flash('success');

  // to disable caching, you can instruct the browser to fetch the resource from the server every time.
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  // if not cached, we will get 304 Not Modified status code instead of 200 OK, which will fail testcases

  let todos;
  if(req.user)todos=await Todo.find({userId:req.user.id})
  const locals={
    username:req.user?.username,
    success: flashMessage.length > 0 ? flashMessage : null,
    todos: todos?todos:null,
  }
  
  // passing username to the ejs view file
  res.status(200).render("index", locals);
});


// Custom Middleware to check whether a user a loggedIn or not
const loggedInMiddleware = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  // if not authenticated, send different responses based on clients
  if(req.isBrowser){
    return res.redirect("/auth/login");
  }
  else{
    return res.status(401).json({message:"Not authenticated!"});
  }
}
// app.use(loggedInMiddleware);


// Mount the todoRouter at '/todos' as a middleware
app.use("/todos",loggedInMiddleware,todosRouter);

// err parameter is the newly added parameter from the previous middleware(by next(errorMessage))
function errorHandler(err, req, res, next) {
  // console.error(err);
  res.status(err.status || 500);
  res.json({error: { message: err.message || 'Internal Server Error'}});
}
app.use(errorHandler);

app.listen(PORT,()=>console.log(`express server running on port ${PORT}`))


module.exports= app;