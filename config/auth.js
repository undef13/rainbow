exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    console.log(
      "Please, log in to view this page. Redirecting to login page..."
    );
    res.redirect("/");
  }
}