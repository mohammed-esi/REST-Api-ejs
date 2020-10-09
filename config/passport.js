const LocalStrategy = require('passport-local').Strategy,
      mongoose = require('mongoose'),
      bcrypt = require('bcryptjs');


// Load Model User
const User = require('../models/user');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, function (email, password, done) {
            // Match user
            User.findOne({
                email: email
            }).then(user => {
                if (!user) {
                    return done(null, false, {message: 'That email is not registred'});
                }

                // Match password
                bcrypt.compare(password, user.password, function (err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Password is not correct'});
                    }
                });
            });
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
};