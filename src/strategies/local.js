const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../database/schemas/users');
const {comparePasswords} =require("../utils/authUtils");
const {localStrategyVerifyFunction} = require("../controllers/auth");

passport.use(new LocalStrategy(localStrategyVerifyFunction));

// serialize user data
passport.serializeUser((user, done) => {
return done(null, user.id);
});

// deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;