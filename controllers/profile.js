// User Model
const User = require(`../models/User`);

// GET => /:profileId
exports.getProfileId = async (req, res, next) => {
  const profileId = req.params.profileId;
  if (req.user.profileId === profileId) {
		const friends = await User.find({ _id: { $in: req.user.friends } }).limit(3).exec();
    res.render("profile/profile", {
      title: req.user.displayName,
			user: req.user,
			friends,
			requestsCounter: req.user.pendingFriends.length,
			path: "profileId"
    });
  } else {
    try {
			const user = await User.findOne({ profileId });
      if (!user) {
        console.log(`User with id '${req.params.profileId}' was not found`);
        return next();
			}

			let actionButton = "ADD_FRIEND";
			
			req.user.pendingFriends.map(pendingFriend => {
				if (pendingFriend.toString() == user._id.toString()) {
					actionButton = "ACCEPT_REQUEST"
				}
			});

			user.pendingFriends.map(pendingFriend => {
				if (pendingFriend.toString() == req.user._id.toString()) {
					actionButton = "CANCEL_REQUEST"
				}
			});

			req.user.friends.map(friend => {
				if (friend.toString() == user._id.toString()) {
					actionButton = "WRITE_MESSAGE"
				}
			});

			const posts = user.posts.filter(post => post.isPublic === true);
			const friends = await User.find({ _id: { $in: user.friends } }).limit(3).exec();

      res.render("profile/watch-profile", {
        title: user.displayName,
        user: user,
				currentUser: req.user,
				posts,
				friends,
				requestsCounter: req.user.pendingFriends.length,
				actionButton,
        path: ""
      });
    } catch (error) {
			console.log(error);
			res.json({
				isSuccessful: false,
				message: "Something went wrong...",
			});
    }
  }
};