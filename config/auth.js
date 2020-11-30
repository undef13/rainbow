exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};

exports.displayIndex = (req, res, next) => {
  if(req.isAuthenticated()) {
    res.redirect(`/${req.user.profileId}`);
  } else {
    next();
  }
}