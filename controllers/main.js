// GET => /
exports.getIndex = (req, res) => {
  res.render("index", {
    errors: req.flash("error"),
  });
};

// GET => /success
exports.getSuccess = (req, res) => {
    res.render("success");
}