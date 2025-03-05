const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                next(err);
            }
            req.flash('success', 'Welcome to YelpGym!');
            res.redirect('/gyms');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login',
    storeReturnTo,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    (req, res, next) => {
        const redirectUrl = res.locals.returnTo || '/gyms';
        req.flash('success', 'Welcome back!');
        res.redirect(redirectUrl);
    }
);

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully Logged Out!');
        res.redirect('/gyms');
    });
});


module.exports = router;