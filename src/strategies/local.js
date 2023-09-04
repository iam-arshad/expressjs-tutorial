const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../database/schemas/users');
const {comparePasswords} =require("../utils/authUtils");

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    // fetch user from db
    const user = await User.findOne({ username: username });

    // if user not found
    if (!user) {
      return done(null, false, { message: 'user not found' });
    }

    // comparePassword
    const passwordMatched = await comparePasswords(password,user.password)
    // if password not matched
    if (!passwordMatched) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    // if everything is okay
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

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