// Dependencies
const express = require(`express`);
const router = express.Router();

// Login checker
const isLoggedIn = require(`../config/auth`).isLoggedIn;

// Controller
const profileController = require(`../controllers/profile`);

router.get(`/:profileId`, isLoggedIn, profileController.getProfileId);

module.exports = router;