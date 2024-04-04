// for jwt authentication
const fetch = require('node-fetch');
const passport = require('passport');
const generateToken = require('../utils/generateToken')
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const db = require('../models/index')
const User = db.publicuser
var opts = {}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRETJWTKEY;

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findByPk(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }));




//   for google authentication 



const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Check if the user already exists in the database
    User.findOne({ googleId: profile.id })
      .then(existingUser => {
        if (existingUser) {
          // User exists, generate tokens and return user
          generateTokens(existingUser, cb);
        } else {
          // User doesn't exist, initiate mobile number collection
          cb(null, { 
            email: profile.emails[0].value, 
            photo: profile.photos[0].value,
            name: profile.displayName,
            requiresMobileVerification: true
          });
        }
      })
      .catch(err => cb(err, false)); // Handle errors when querying the database
  }));



// for facebook authentication
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:8000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Check if the user already exists in the database
    User.findOne({ facebookId: profile.id })
      .then(existingUser => {
        if (existingUser) {
          // User exists, generate tokens and return user
          generateTokens(existingUser, cb);
        } else {
          // User doesn't exist, initiate additional steps
          cb(null, { 
            email: profile.emails[0].value, 
            photo: profile.photos[0].value,
            name: profile.displayName,
            requiresMobileVerification: true
          });
        }
      })
      .catch(err => cb(err, false)); // Handle errors when querying the database
  }
));



module.exports = passport;



