const express = require(`express`);
const router = express.Router();

// Controller
const friendsController = require("../controllers/friends");

router.get(`/friends`, friendsController.getFriends);

// router.get(`/friends/add-cards`, friendsController.getAdditionalCards);

module.exports = router;