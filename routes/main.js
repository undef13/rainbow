// Dependencies
const express = require(`express`);
const router = express.Router();

// Login checker
const isLoggedIn = require(`../config/auth`).isLoggedIn;
const displayIndex = require(`../config/auth`).displayIndex;

// Controller
const mainController = require(`../controllers/main`);

router.get(`/`, displayIndex, mainController.getIndex);

router.get(`/:profileId`, isLoggedIn, mainController.getProfileId);

router.post(`/:profileId/add-post`, isLoggedIn, mainController.postAddPost);

router.post(`/:profileId/delete-post`, isLoggedIn, mainController.postDeletePost);

module.exports = router;