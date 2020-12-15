// User Model
const User = require(`../models/User`);

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

// GET => /:profileId
exports.getProfileId = async (req, res, next) => {
  const profileId = req.params.profileId;
  if (req.user.profileId === profileId) {
    res.render("profile/profile", {
      title: req.user.displayName,
      user: req.user,
      path: "profileId",
    });
  } else {
    try {
      const user = await User.findOne({ profileId });
      if (!user) {
        console.log(`User with id '${req.params.profileId}' was not found`);
        return next();
			}
			const posts = user.posts.filter(post => post.isPublic === true);

      res.render("profile/watch-profile", {
        title: user.displayName,
        user: user,
				currentUser: req.user,
				posts,
        path: "",
      });
    } catch (error) {
      console.log(error);
    }
  }
};