const mongoose = require('mongoose');

// Connect to MongoDB
// copy the connection string from your compass app'n
mongoose.connect('mongodb://localhost:27017/test',{family:4})
.then(()=>console.log("connected to DB"));