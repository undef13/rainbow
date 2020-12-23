// Dependency
const User = require(`../models/User`);
const ejs = require(`ejs`);

// GET => /friends
exports.getFriends = async (req, res) => {
	const limit = 5;
	const { page = 1, ajax = false } = req.query;
	const users = await User.find({ profileId: { $nin: [req.user.profileId] } })
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.exec();
	if (ajax) {
		const newUsers = ejs.render(html, {users});
		res.json({
			isSuccessful: true,
			message: "Success",
			data: {
				newUsers
			},
		});
	} else {
		res.render("friends/friends", {
			allUsers: users,
			user: req.user,
			path: "friends"
		});
	}
}
const html = `<% for( let i = 0; i < users.length; i++ ) { %>
	<div class="wrapper user-card">
		<div class="row">
			<div class="col-md-auto">
				<img
					class="display-image"
					src="<%= users[i].imageUrl %>"
					alt=""
				/>
			</div>
			<div class="col-md-9 display-user-info">
				<div class="display-name">
					<a href="/<%= users[i].profileId %>"><span><%= users[i].displayName %></span></a>
				</div>
				<hr />
				<div class="display-bio text-break">
					<span><%= users[i].bio %></span>
				</div>
			</div>
			<div class="col-md-auto align-self-center add-friend">
				<button class="btn btn-primary">Add friend</button>
			</div>
		</div>
	</div>
	<% } %>`

// POST => /friends
exports.postFriends = async (req, res) => {
	const { searchName } = req.body;
	const regExp = new RegExp(searchName, 'i');
	try {
		const users = await User.find({displayName: { $regex: regExp }});
		res.render("friends/friends-search", {
			allUsers: users,
			user: req.user,
			path: "friends"
		})
	} catch (error) {
		console.log(error);
	}
}