const mongoose = require('mongoose');

// Connect to MongoDB
const connectionString=process.env.MONGODB_CONNECTION_STRING;

mongoose.connect(connectionString,{family:4})
.then(()=>console.log("connected to DB"));