import passport from 'passport';
import UserModel from '../models/userModel.js';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';

passport.use(
    new LocalStrategy( { usernameField: 'username', passwordField: 'password' }, (username, password, done) => {
        // Match User
        UserModel.findOne({
            "$or": [{
                username: username
            }, {
                email: username
            }]
        }).then(user => {
            if(!user) {
                return done(null, false);
            }
            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    return done(null,user);
                }else{
                    return done(null, false);
                }
            });
        }).catch(err => console.log(err));
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
    
passport.deserializeUser((id, done) => {
    UserModel.findById(id, function (err, user) {
        done(err, user);
    });
});