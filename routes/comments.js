var express = require('express'),
	middleware = require('../middleware'),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    router = express.Router({mergeParams: true});
    
// =========================
// COMMENTS ROUTES
// =========================
// NEW ROUTE
router.get('/new', middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err || !campground) {
			req.flash('error', 'A comment can not be created at this time. Try again later');
			res.redirect('/campgrounds');
		} else {
			res.render('comments/new', {campground: campground});
		}
	});
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err || !campground) {
			req.flash('error', 'The campground could not be found');
			res.redirect('back');
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err || !comment) {
					req.flash('error', 'The comment could not be created');
					res.redirect('back');
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					
					// save comment
					comment.save();
					
					// add comment to campground
					campground.comments.push(comment);
					
					// save campground
					campground.save();
					
					// redirect to campground page
					req.flash('success', 'Your comment was posted');
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

// EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if (err || !campground) {
			req.flash('error', 'Your comment can not be updated at this time. Try again later');
			res.redirect('/campgrounds');
		} else {
			res.render('comments/edit', {campground_id: req.params.id, comment: req.comment});
		}
	});
});

// UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
		if (err) {
			req.flash('error', 'The comment was not found');
			res.redirect('back');
		} else {
			req.flash('success', 'Your comment was updated');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			req.flash('error', 'The comment was not found');
			res.redirect('back');
		} else {
			req.flash('success', 'Your comment was deleted');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

// =========================
// MODULE EXPORT
// =========================
module.exports = router;