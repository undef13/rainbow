// GET => /
exports.getIndex = (req, res) => {
  res.render("start-page/start-page", {
		// errors: req.flash("error"),
		errors: []
  });
};

// GET => /about
exports.getAbout = (req, res) => {
	res.render("about-page/about", {
		user: req.user,
		path: ""
	});
}