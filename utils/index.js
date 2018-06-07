var regexMethods;

// =========================
// CUSTOM REGEX METHODS
// =========================
regexMethods = {
	escape: function(text) {
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	}
};

module.exports = {
	regexMethods: regexMethods
};