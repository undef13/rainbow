// User Model
const { json } = require("express");
const User = require(`../models/User`);

// GET => /
exports.getIndex = (req, res) => {
  res.render("start-page/start-page", {
    errors: req.flash("error"),
  });
};

// GET => /:profileId
exports.getProfileId = async (req, res, next) => {
	const profileId = req.params.profileId;
	if(req.user.profileId === profileId) {
		res.render("profile/profile", {
			title: req.user.displayName,
			user: req.user,
			path: "profileId"
		});
	} else {
		try {
			const user = await User.findOne({ profileId });
			if (!user) {
				console.log(`User with id '${req.params.profileId}' was not found`);
				return next();
			}
			res.render("profile/watch-profile", {
				title: user.displayName,
				user: user,
				currentUser: req.user,
				path: ""
			})
		} catch (error) {
			console.log(error);
		}
	}
};

// POST => /profileId/add-post
exports.postAddPost = async (req, res) => {
	const { postText, isVisible } = req.body;
	const isPublic = isVisible == "Public" ? true : false;
	try {
		const user = await User.findOne({ profileId: req.user.profileId });
		const newPost = {
			postText: postText,
			publicationDate: new Date(),
			isPublic: isPublic
		};
		user.posts.push(newPost);
		await user.save();
		res.redirect(`/${user.profileId}`);
	} catch (error) {
		console.log(error);
	}
}

// exports.postAddPost = async (req, res) => {

// }

// POST => /profileId/delete-post
exports.postDeletePost = async (req, res) => {
	const { postId } = req.body;
	try {
		const user = await User.findOne({ profileId: req.user.profileId });
		user.posts = user.posts.filter(post => post._id != postId);
		await user.save();
		res.redirect(`/${user.profileId}`);
	} catch (error) {
		console.log(error);
	}
	
}