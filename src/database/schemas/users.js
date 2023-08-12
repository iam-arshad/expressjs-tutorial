const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

module.exports= mongoose.model('User', userSchema);
