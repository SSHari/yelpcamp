var Campground = require('../models/campground'),
	Comment = require('../models/comment');

// =========================
// MODULE EXPORT
// ========================= 
module.exports = {
	isLoggedIn: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash('error', 'You need to be logged in to do that');
		res.redirect('/login');
	},
	
	checkCampgroundOwnership: function(req, res, next) {
		if (req.isAuthenticated()) {
			Campground.findById(req.params.id, function(err, campground) {
				if (err || !campground) {
					req.flash('error', 'The campground could not be found');
					res.redirect('back');
				} else if (campground.author.id.equals(req.user._id)) {
					req.campground = campground;
					next();
				} else {
					req.flash('error', 'You do not have permission to do that');
					res.redirect('back');
				}
			});
		} else {
			req.flash('error', 'You need to be logged in to do that');
			res.redirect('back');
		}
	},
	
	checkCommentOwnership: function(req, res, next) {
		if (req.isAuthenticated()) {
			Comment.findById(req.params.comment_id, function(err, comment) {
				if (err || !comment) {
					req.flash('error', 'The comment could not be found');
					res.redirect('back');
				} else if (comment.author.id.equals(req.user._id)) {
					req.comment = comment;
					next();
				} else {
					req.flash('error', 'You do not have permission to do that');
					res.redirect('back');
				}
			});
		} else {
			req.flash('error', 'You need to be logged in to do that');
			res.redirect('back');
		}
	}
};