const express=require("express")
const cookieParser = require('cookie-parser');
const todosRouter=require("./routes/todos/todos");
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

// Route to set a cookie
app.get('/set-cookie', (req, res) => {
  // Set a cookie named "username" with value "john"
  res.cookie('username', 'john', { maxAge: 900000, httpOnly: true }); // maxAge is in milliseconds
  res.send('Cookie has been set.');
});

// Route to retrieve a cookie
app.get('/get-cookie', (req, res) => {
  // Retrieve the value of the "username" cookie
  const username = req.cookies.username;
  if (username) {
    res.send(`Welcome back, ${username}!`);
  } else {
    res.send('No username cookie found.');
  }
});




// Mount the todoRouter at '/todos' as a middleware
app.use("/todos",todosRouter);

app.listen(PORT,()=>console.log(`express server running on port ${PORT}`))
