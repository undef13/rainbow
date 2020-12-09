// User Model
const ejs = require(`ejs`);
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
// exports.postAddPost = async (req, res) => {
// 	const { postText, isVisible } = req.body;
// 	const isPublic = isVisible == "Public" ? true : false;
// 	try {
// 		const user = await User.findOne({ profileId: req.user.profileId });
// 		const newPost = {
// 			postText: postText,
// 			publicationDate: new Date(),
// 			isPublic: isPublic
// 		};
// 		user.posts.push(newPost);
// 		await user.save();
// 		res.redirect(`/${user.profileId}`);
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

exports.postAddPost = async (req, res) => {
	const { isPublic, postText } = req.body;
	const newPost = {
		postText,
		publicationDate: new Date(),
		isPublic
	}
	try {
		const user = await User.findOne({ profileId: req.user.profileId });
		user.posts.push(newPost);
		await user.save();
		const htmlNewPost = ejs.render(`
		<div class="wrapper">
			<div class="post">
				<div class="d-flex justify-content-between post-header">
					<div
						class="d-flex justify-content-start post-creator-container"
					>
						<div>
							<img
								style="width: 50px; border-radius: 50%"
								src="<%= user.imageUrl %>"
								alt=""
							/>
						</div>
						<div>
							<div><%= user.displayName %></div>
							<div>
								<%= newPost.publicationDate.toLocaleDateString("en-US", {
								year: 'numeric', month: 'long', day: 'numeric', hour:
								'numeric', minute: "numeric" }) %>
							</div>
						</div>
					</div>
					<div class="dropdown">
						<button
							class="btn btn-sm dropdown-toggle"
							type="button"
							id="dropdownMenuButton"
							data-toggle="dropdown"
							aria-haspopup="true"
							aria-expanded="false"
						>
							<i class="fas fa-chevron-down"></i>
						</button>
						<div
							class="dropdown-menu dropdown-menu-right"
							aria-labelledby="dropdownMenuButton"
						>
							<button type="submit" class="dropdown-item" href="#">Delete</button>
							<a class="dropdown-item" href="#">Edit</a>
						</div>
					</div>
				</div>
				<div class="text-justify"><%= newPost.postText %></div>
				<hr />
				<div class="post-footer d-flex justify-content-between">
					<div>
						likes	
					</div>
					<div>
						<%= newPost.isPublic ? "Public" : "Private" %>
					</div>
				</div>
			</div>
	</div>`, { user, newPost });
	res.json({
		isSuccessful: true,
		data: {
			htmlNewPost
		}
	});
	} catch (error) {
		console.log(error);
		res.json({
			isSuccessful: false,
			message: "Something went wrong...",
		});
	}
}

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