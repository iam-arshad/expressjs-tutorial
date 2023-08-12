const mongoose = require('mongoose');

// Connect to MongoDB
// copy the connection string from your compass app'n
mongoose.connect('mongodb://127.0.0.1:27017/test')
.then(()=>console.log("connected to DB"));