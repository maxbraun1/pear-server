import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2';
import UserModel from '../models/userModel.js';

import dotenv from 'dotenv'
dotenv.config()

if(process.env.PROD == 1){
  var callback = "https://pear-programming-server-b49o.onrender.com/auth/google/callback";
}else{
  var callback = "http://localhost:3001/auth/google/callback";
}
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callback,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    UserModel.findOne({
      'email': profile.email
    }, async function(err, user) {
        if (err) {
          done(err,null);
        }
        //No user was found...
        else if (!user) {
            const newUserDoc = new UserModel({
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.email,
              profilePicture: profile.picture,
              accountCreationTimestamp: Date.now(),
              nativeAccount: false
            });
            newUserDoc.save().then((newUser) => {
              done(null, newUser);
            });
        } else {
          done(null,user);
        }
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id,function(err,user){
    done(err, user);
  });
});