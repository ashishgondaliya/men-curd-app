/**
 * This route is not commented. Follow through, HomeRoute.js file first to understand how routing works.
 * After it, this file is self explanatory.
 */

const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs');
const passport = require('passport')

let User = require('../AppModel/userModel');


//ROUTE: '/register' (Register View)
router.get('/register', function(req, res){
    res.render('register');/* a view 'register' */
});


//ROUTE: '/register' (Register User)
//User registration route
router.post('/register', function(req, res){
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is requird').notEmpty();
    req.checkBody('email', 'Email is requird').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is requird').notEmpty();
    req.checkBody('password', 'Password is requird').notEmpty();
    req.checkBody('password2', 'Confirm is requird').equals(req.body.password2);

    let errors = req.validationErrors();

    if(errors){
        res.render('register', {
            errors: errors
        });
    }else{
        let newUser = new User({
            name:name,
            email: email,
            username: username,
            password: password
        });
        //Encrypting the password into hash
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        req.flash('success', "You are now registered.");
                        res.redirect('/user/login');
                    }

                });
            });
        });
        
    }
});


//ROUTE: '/login' (Login View)
router.get('/login', function(req, res){
    res.render('login');
});


//ROUTE: '/login' (Authenticate)
router.post('/login', function(req, res, next){
    passport.authenticate('local' /* Strategy (Passport) */, {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
})


//ROUTE: '/logout' (Logout)
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/user/login');
});


module.exports = router;