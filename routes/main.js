// Dependencies
const express = require(`express`);
const router = express.Router();

// Login checker
const isLoggedIn = require(`../config/auth`).isLoggedIn;

// Controller
const mainController = require(`../controllers/main`);

// GET => /
router.get(`/`, mainController.getIndex);

// GET => /success
router.get(`/success`, isLoggedIn, mainController.getSuccess);

module.exports = router;
