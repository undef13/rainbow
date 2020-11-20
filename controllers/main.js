exports.getIndex = (req, res) => {
  res.render("index", {
    errors: req.flash("error"),
  });
};

exports.getSuccess = (req, res) => {
    res.render("success");
}