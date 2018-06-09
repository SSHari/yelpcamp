var express = require('express'),
    passport = require('passport'),
    User = require('../models/user'),
    router = express.Router();

// =========================
// INDEX ROUTES
// =========================
router.get('/', function(req, res) {
	res.render('landing');
});

// =========================
// AUTH ROUTES
// =========================
router.get('/register', function(req, res) {
	res.render('register', {page: 'register'});
});

router.post('/register', function(req, res) {
	var newUser = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		avatar: req.body.avatar,
		username: req.body.username
	});
	
	if (!req.body.firstName || !req.body.lastName || !req.body.email) {
		return res.render('register', {errorMessage: 'Please provide a first name, last name and email'});
	} else {
		User.register(newUser, req.body.password, function(err, user) {
			if (err) {
				return res.render('register', {errorMessage: err.message});
			}
			passport.authenticate('local')(req, res, function() {
				req.flash('success', 'Welcome to YelpCamp ' + user.username);
				res.redirect('/campgrounds');
			});
		});
	}
});

router.get('/login', function(req, res) {
	res.render('login', {page: 'login'});
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/campgrounds',
	failureRedirect: '/login',
	successFlash: 'Welcome!',
	failureFlash: 'There was an issue with the credentials provided'
}), function(req, res) {
});

router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'Logged you out!');
	res.redirect('/campgrounds');
});

// =========================
// MODULE EXPORT
// =========================
module.exports = router;