var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	flash = require('connect-flash'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	User = require('./models/user');

// =========================
// ROUTES
// =========================
var campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments'),
	userRoutes = require('./routes/users'),
	indexRoutes = require('./routes/index');

// =========================
// CREATE EXPRESS APP
// =========================
var app = express();

// =========================
// MONGOOSE CONNECTION
// =========================
mongoose.connect(process.env.DATABASE_URL);

// =========================
// SETUP EXPRESS APP
// =========================
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use('/assets', express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// =========================
// MOMENTJS CONFIG
// =========================
app.locals.moment = require('moment');

// =========================
// PASSPORT CONFIG
// =========================
app.use(require('express-session')({
	secret: process.env.EXPRESS_SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Use middleware to setup user info
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.successMessage = req.flash('success');
	res.locals.errorMessage = req.flash('error');
	next();
});

// =========================
// SETUP EXPRESS ROUTES
// =========================
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/users', userRoutes);

// Catch all route redirects to root page
app.get('*', function(req, res) {
	res.redirect('/');
});

// =========================
// START SERVER
// =========================
app.listen(process.env.PORT, process.env.IP, function() {
	console.log('The Yelp Camp Server Has Started!');
});