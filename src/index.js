const express=require("express")
const todosRouter=require("./routes/todos/todos");
const app=express()
const PORT=3000


// Custom Middleware
const myMiddleware = function(req, res, next) {
    console.log('This is my custom middleware!',req.url,req.path);
    //write your custom logic here
    next();// Call next to pass the control to the next middleware
  };
  
// Using the custom middleware
app.use(myMiddleware);

// Mount the todoRouter at '/todos' as a middleware
app.use("/todos",todosRouter);

app.listen(PORT,()=>console.log(`express server running on port ${PORT}`))
