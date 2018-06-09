var express = require('express'),
	Campground = require('../models/campground'),
	User = require('../models/user'),
	router = express.Router();

// =========================
// USER ROUTES
// =========================
router.get('/:user_id', function(req, res) {
	User.findById(req.params.user_id, function(err, user) {
		if (err || !user) {
			req.flash('error', 'No user found');
			res.redirect('back');
		} else {
			Campground.find().where('author.id').equals(user._id).exec(function(err, campgrounds) {
				campgrounds = campgrounds === null ? [] : campgrounds;
				if (err) {
					req.flash('error', 'There was an error with your request');
					req.redirect('back');
				} else {
					res.render('users/show', {user: user, campgrounds: campgrounds});
				}
			});
		}
	});
});

// =========================
// MODULE EXPORT
// =========================
module.exports = router;