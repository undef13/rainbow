// Dependency
const User = require(`../models/User`);

// GET => /friends
exports.getFriends = async (req, res) => {
	const { page = 1, limit = 5 } = req.query;

	try {
		const users = await User.find({ profileId: { $nin: [req.user.profileId] } })
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.exec();
			res.render("friends/friends", {
				allUsers: users,
				user: req.user,
				path: "friends"
			});
	} catch (error) {
		console.log(error);
	}
}