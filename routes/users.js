const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, ensureAuthenticatedEditProfile } = require('../config/auth');

// Load User Model
const User = require('../models/user');
  


//Login Page 
router.get('/login', function (req, res) {
    res.render('login');
});


// Register Page
router.get('/register', function (req ,res) {
    res.render('register');
});


// Dashboard Page
router.get('/dashboard', ensureAuthenticated, function (req, res) {
    res.render('dashboard');
});


// Register Form
router.post('/register', function (req, res) {
    const {name, email, password, password2} = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({msg: 'Please enter all fields'});
    }
    if (password != password2) {
        errors.push({msg: 'Password do not match'});
    }
    if (password.length < 6) {
        if (!name || !email || !password || !password2) {
            errors.push();
        } else {
            errors.push({msg: 'Password must be at least 6 charcters'});
        }
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
        } else {
        User.findOne({email: email}).then(user => {
            if (user) {
                errors.push({msg: 'Email already exists'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, function (err, hash) {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save().then(user => {
                            req.flash(
                                'success_msg', 
                                'You are now register and can log in'
                            );
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});


// Login 
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});



// Logout
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});


// Load Edit Form
router.get('/edit_profile', ensureAuthenticatedEditProfile, function (req, res) {
    User.find(req.params.id, function (err) {
        if (err) throw err;
        res.render('edit-profile', {
            title: 'Edit Profile'
        });
    });
});


// Update Submit post Route
router.post('/edit_profile', function (req, res) {
    let user = {};
    user.name = req.body.name;
    user.email = req.body.email;

    let query = {_id: req.params.id};

    User.update(query, user, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success_msg', 'Your profile is update');
            res.redirect('/');
        }
    });
});




module.exports = router;