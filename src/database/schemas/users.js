const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId:String,
  refreshTokens:[String],
});

module.exports= mongoose.model('User', userSchema);
