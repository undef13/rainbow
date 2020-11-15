const express = require(`express`);
const path = require(`path`);

const isLoggedIn = require(`../config/auth`).isLoggedIn;

const router = express.Router();

const p = path.join(__dirname, "../views");

router.get(`/`, (req, res) => {
  console.log(req.isAuthenticated());
  res.sendFile(p + "/index.html");
});

router.get(`/success`, isLoggedIn, (req, res, next) => {
  console.log(req.isAuthenticated());
  res.sendFile(p + "/success.html");
});

module.exports = router;
