const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../database/schemas/users');

module.exports = function initializeGoogleOAuth() {
  // Middleware to dynamically set the callback URL
  return (req, res, next) => {
    const callbackURL = `${req.protocol}://${req.get('host')}/auth/api/google/redirect`;

    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL, // Set dynamically
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const existingUser = await User.findOne({ googleId: profile.id });
            if (existingUser) {
              return done(null, existingUser);
            }

            const newUser = new User({
              googleId: profile.id,
              username: profile.emails[0].value,
            });

            await newUser.save();
            done(null, newUser);
          } catch (error) {
            done(error);
          }
        }
      )
    );

    // Serialize user data
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    // Deserialize user data
    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (error) {
        done(error);
      }
    });

    next();
  };
};
