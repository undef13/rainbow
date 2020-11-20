const express = require(`express`);
const path = require(`path`);

const isLoggedIn = require(`../config/auth`).isLoggedIn;

const router = express.Router();

const p = path.join(__dirname, "../views");

router.get(`/`, (req, res) => {
  // console.log(req.flash());
  res.render("index", {
    errors: req.flash("error")
  });
});

router.get(`/success`, isLoggedIn, (req, res, next) => {
  res.render("success");
});

module.exports = router;
