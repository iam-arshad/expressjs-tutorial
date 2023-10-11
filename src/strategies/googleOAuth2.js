const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../database/schemas/users');


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      // This function will be called when a user is authenticated via Google.
      //   console.log("googleOAuthFile",accessToken,refreshToken,profile);
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        // console.log("existingUser");
        return done(null, existingUser);
      }

      const newUser = new User({
        googleId: profile.id,
        username: profile.emails[0].value, // You can set the username from Google email
      });

      // console.log("new User");
      await newUser.save();
      done(null, newUser);
      // return done(null, profile);
    }
  )
);

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
