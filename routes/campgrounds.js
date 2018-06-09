var express = require('express'),
	utils = require('../utils'),
	middleware = require('../middleware'),
    Campground = require('../models/campground'),
    router = express.Router();

// =========================
// CAMPGROUND ROUTES
// =========================
// INDEX ROUTE
router.get('/', function(req, res) {
	var queryObj = {};
	if (req.query.search) {
		queryObj.name = new RegExp(utils.regexMethods.escape(req.query.search), 'gi');
		Campground.find(queryObj, function(err, campgrounds) {
			if (err || !campgrounds || campgrounds.length === 0) {
				res.render('campgrounds/index', {campgrounds: campgrounds, page: 'campgrounds', errorMessage: 'No campgrounds were found with your search'});
			} else {
				res.render('campgrounds/index', {campgrounds: campgrounds, page: 'campgrounds'});
			}
		});
	} else {
		Campground.find(queryObj, function(err, campgrounds) {
			if (err || !campgrounds) {
				req.flash('error', 'No campgrounds could be found');
				res.redirect('/');
			} else {
				res.render('campgrounds/index', {campgrounds: campgrounds, page: 'campgrounds'});
			}
		});
	}
});

// NEW ROUTE
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('campgrounds/new');
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, function(req, res) {
	var author = {
			id: req.user._id,
			username: req.user.username
		};
	
	req.body.campground.author = author;
		
	Campground.create(req.body.campground, function(err, campground) {
		if (err) {
			req.flash('error', 'Your campground could not be created');
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Your campground has been created');
			res.redirect('/campgrounds');
		}
	});
});

// SHOW ROUTE
router.get('/:id', function(req, res) {
	Campground.findById(req.params.id).populate('comments').exec(function(err, campground) {
		if (err || !campground) {
			req.flash('error', 'The campground could not be found');
			res.redirect('/campgrounds');
		} else {
			res.render('campgrounds/show', {campground: campground});
		}
	});
});

// EDIT ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
	res.render('campgrounds/edit', {campground: req.campground});
});

// UPDATE ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
		if (err) {
			req.flash('error', 'Your campground could not be updated');
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Your campground has been updated');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// DESTROY ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			req.flash('error', 'Your campground could not be deleted');
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Your campground has been deleted');
			res.redirect('/campgrounds');
		}
	});
});

// =========================
// MODULE EXPORT
// =========================
module.exports = router;