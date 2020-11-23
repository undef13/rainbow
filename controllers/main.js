const User = require(`../models/User`);

// GET => /
exports.getIndex = (req, res) => {
  res.render("start-page/index", {
    errors: req.flash("error"),
  });
};

// GET => /:profileId
exports.getProfileId = async (req, res, next) => {
  try {
    const user = await User.findOne({ profileId });

    if (!user) {
      console.log(`User with id ${profileId} was not found`);
      return next();
    }
  } catch (error) {
    console.log(error);
  }

  res.render("profile/current-user-profile", {
    title: req.user.displayName,
    user: req.user,
  });
};

// GET => /settings
exports.getSettings = (req, res) => {
  res.render("profile/settings", {
    user: req.user
  })
}