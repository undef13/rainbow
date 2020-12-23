const express = require(`express`);
const router = express.Router();

// Controller
const friendsController = require("../controllers/friends");

router.get(`/friends`, friendsController.getFriends);

router.post(`/friends`, friendsController.postFriends);

module.exports = router;