var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var mid = require('../middleware');
var User = require('../models/users');

// GET /
router.get('/', function(req, res, next) {
    return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
    return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
    return res.render('contact', { title: 'Contact' });
});

// GET /register
router.get('/register', mid.loggedOut, function(req, res, next){
    return res.render("register", { title: 'Sign Up' });
})

// POST /register
router.post('/register', function(req, res, next){
    if( req.body.email && req.body.name && req.body.favoriteBook && req.body.password && req.body.confirmPassword ){
        if(req.body.password !== req.body.confirmPassword){
            var err = new Error("Passwords don't match");
            return next(err);
        }

        // if post data correct
        var userData = {
            email: req.body.email,
            name: req.body.name,
            favoriteBook: req.body.favoriteBook,
            password: req.body.password
        };

        // schema's insert method
        User.create(userData, function(error, user){
            if(error){
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        })

    } else {
        var err = new Error("All fields required");
        err.status = 400;
        return next(err);
    }
})

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next){
    return res.render("login", { title: 'login' });
})

// POST /login
router.post('/login', function(req, res, next){
    if(req.body.email && req.body.password){
        User.findOne({email: req.body.email}).exec( function(err, user){
            if(err){
                console.log(err);
                next(err);
            } else if (!user){
                var err = new Error("user doensn't exist")
                next(err)
            } else {
                bcrypt.compare(req.body.password, user.password, function(err, result){
                    if(result===true){
                        req.session.userId = user._id;
                        return res.redirect('/profile')
                    } else {
                        var err = new Error('wrong password');
                        next(err);
                    }
                })
            }
        })
    } else {
        var err = new Error('Email and password are required');
        err.status = 401;
        return next(err)
    }
})

// GET /logout
router.get('/logout', function(req, res, next){
    if(req.session){
        req.session.destroy( function(err){
            if(err){
                next(err);
            } else {
                return res.redirect("/");
            }
        })
    }
})

// GET /profile
router.get('/profile', mid.loggedIn,function(req, res, next){
    User.findById(req.session.userId).exec( function(error, user){
        if(error){
            next(error);
        } else if(!user){
            var err = new Error("user doesn't exist");
            next(err)
        } else {
            return res.render('profile', {title: "profile page", name: user.name, favorite: user.favoriteBook})
        }
    })
})

module.exports = router;
