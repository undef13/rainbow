// Dependencies
const express = require(`express`);
const router = express.Router();

// Login checker
const isLoggedIn = require(`../config/auth`).isLoggedIn;

// Controller
const mainController = require(`../controllers/main`);

router.get(`/`, mainController.getIndex);

router.get(`/success`, isLoggedIn, mainController.getSuccess);

module.exports = router;
