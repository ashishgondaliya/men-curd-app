//Setting up Express framework.
const express = require('express');
const theApp = express();

//Setting PATH to be used everywhere.
const path = require('path');

//Setting up Pug template engine.
theApp.set('views', path.join(__dirname, 'AppView'));
theApp.set('view engine', 'pug');

//Setting 'public' as a installation directory for 'bower' (NOT USED)
theApp.use(express.static(path.join(__dirname, 'public')));

//Setting up mongoose to conect and use MongoDB
//NOTE: You must have MongoDB installed and have the 'nodejs_crud_app' database set up.
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodejs_crud_app');
let db = mongoose.connection;
db.on('error', function(err){
    console.log('NODE JS CRUD APP: #Error# connecting to MongoDB.');
});
db.once('open', function(){
    console.log('NODE JS CRUD APP: Connected to MongoDB.');
});

//Setting up Express Validator for form validation.
//NOTE: Go through 'express-validation' documentation online.
const expressValidator = require('express-validator')
theApp.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.'),
        root = namespace.shift()
        , formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//Setting 'connect-flsh' and 'express-message' for flash messages.
//NOTE: Go through documentation online.
const flash = require('connect-flash')
theApp.use(require('connect-flash')());
theApp.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//Setting up 'express-session' for managing session authentication.
//NOTE: Go through online documentation.
const session = require('express-session')
theApp.use(session({
    secret: 'keyboard cat',
    resave: /*false*/ true,
    saveUninitialized: true,
    // If not serving your server over HTTPS, in which case the following will prevent session cookies from being set:
    /*cookie: { secure: true }*/
}));

//Setting up 'passport' for authentication machenism.
//NOTE: Go through online documentation.
const passport = require('passport');
require('./Configurations/passport')(passport);
theApp.use(passport.initialize());
theApp.use(passport.session());

//Setting up 'body-parser' for parsing form body.
//NOTE: Go through online documentation.
var bodyParser = require('body-parser')
theApp.use(bodyParser.urlencoded({ extended: false }))
theApp.use(bodyParser.json())






/**
 * ROUTE TEST PURPOSE
 * Uncomment to see it working.
 * 
 * Set up '/' (root) route (i.e., the default page: http://localhost:3000/ is called in browser).
 * When user visits above url the the page will return "Hello Their!" message.
 * 
 * And, when http://localhost:3000/someview is called then the view '/AppView/testView.pug'
 * is returned.
 */
/*
theApp.get('/', function(req, res){
    res.send('Hello Their!');
});

theApp.get('/someview', function(req, res){
    res.render('testView');
});
*/



/**
 * CHECK USER AUTHENTICATION EVERYWHERE FOR ALL ROUTES
 * Create a global 'user' variable that varifies if the user
 * is authenticated or not.
 */
theApp.get('*' /* all route*/, function(req, res, next){
    //if the user exists or null
    res.locals.user = req.user || null; 
    //it will call next route or next peace of middle ware
    next();
})



/**
 * HOME ROUTES
 * We will define a home routes in '/AppRoute/HomeRoute.js' file.
 *
 * We will basically redirect any routes to '/' (root) or '/article' to HomeRoute.js file, where
 * the routes will be defined as required.
 * 
 * Follow through, comments in HomeRoute.js file.
 */
let homeRoute = require('./AppRoute/HomeRoute');
theApp.use('/', homeRoute);
theApp.use('/article', homeRoute);



/**
 * USER ROUTE
 * We will define a home routes in '/AppRoute/UserRoute.js' file.
 * 
 * We will basically redirect any routes to '/user' to UserRoute.js file, where
 * the routes will be defined as required.
 * 
 * Follow through, comments in HomeRoute.js file.
 */
let userRoute = require('./AppRoute/UserRoute');
theApp.use('/user', userRoute);








/**
 * ENSURE IF USER IS AUTHENTICATED
 * Check if the user is authenticated:
 *      If the user is not authenticated, then it will flash error message and redirect to login page.
 *      Else, it proceed to middleware or route.
 */
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{        
        req.flash('danger', 'You need to login.');
        res.redirect('/users/login');
    }
}







//Start server and start listening to port 3000
//NOTE: Configure port as you like.
theApp.listen(3000, function(){
    console.log('NODE JS CRUD APP: Server started on port 3000.');
});