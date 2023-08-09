const express=require("express")
const cookieParser = require('cookie-parser');
const todosRouter=require("./routes/todos/todos");
const authRouter=require("./routes/auth/auth");
const app=express()
const PORT=3000


// Custom Middleware
const myMiddleware = function(req, res, next) {
    console.log('This is my custom middleware!');
    //write your custom logic here
    next();// Call next to pass the control to the next middleware
  };
  
// Using the custom middleware
app.use(myMiddleware);

// Middleware to parse cookies
app.use(cookieParser());


// Mount the todoRouter at '/todos' as a middleware
app.use("/todos",todosRouter);
app.use("/auth",authRouter);

app.listen(PORT,()=>console.log(`express server running on port ${PORT}`))
