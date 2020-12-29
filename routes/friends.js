const express = require(`express`);
const router = express.Router();

// Controller
const friendsController = require("../controllers/friends");

router.get(`/`, friendsController.getFriends);

router.post(`/`, friendsController.postFriends);

router.post(`/add-friend`, friendsController.postAddFriend);

router.get(`/your-friends`, friendsController.getYourFriends);

router.get(`/pending-requests`, friendsController.getPendingRequests);

module.exports = router;