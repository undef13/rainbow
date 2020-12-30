// Dependency
const User = require(`../models/User`);
const ejs = require(`ejs`);
const mongoose = require(`mongoose`);

// GET => /friends
exports.getFriends = async (req, res) => {
	const limit = 7;
	const { page = 1, ajax = false } = req.query;
	const users = await User.find({ profileId: { $ne: req.user.profileId }, _id: { $nin: req.user.friends } })
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
			path: "friends",
			path2: "friends"
		});
	}
}
const html = `<% for( let i = 0; i < users.length; i++ ) { %>
	<div class="wrapper user-card">
		<div class="row">
			<div class="col-md-2">
				<img
					class="display-image"
					src="<%= users[i].imageUrl %>"
					alt=""
				/>
			</div>
			<div class="col-md-10 display-user-info">
				<div class="display-name">
					<a href="/<%= users[i].profileId %>"><span><%= users[i].displayName %></span></a>
				</div>
				<hr />
				<div class="display-bio text-break">
					<span><%= users[i].bio %></span>
				</div>
			</div>
		</div>
		<div class="d-flex buttons-container">
			<div class="ms-auto">
				<button class="btn btn-sm btn-primary" onclick="addFriend('<%= users[i]._id %>')">Send request</button>
			</div>
		</div>
	</div>
	<% } %>`

// POST => /friends
// User search
exports.postFriends = async (req, res) => {
	const { searchName } = req.body;
	const regExp = new RegExp(searchName, 'i');
	try {
		const users = await User.find({ 
			displayName: { $regex: regExp }, 
			profileId: { $ne: req.user.profileId }, 
			_id: { $nin: req.user.friends } }
		);
		res.render("friends/friends-search", {
			allUsers: users,
			user: req.user,
			path: "friends",
			path2: "friends"
		})
	} catch (error) {
		console.log(error);
	}
}

// POST => /friends/add-friend
exports.postAddFriend = async (req, res) => {
	const {userId} = req.body;
	try {
		const currentUser = await User.findOne({profileId: req.user.profileId});
		const friend = await User.findOne({_id: userId});

		for(let pendingFriendId of currentUser.pendingFriends) {
			if(pendingFriendId.toString() === userId.toString()) return res.json({
				isSuccessful: false,
				message: "Accept request of this user"
			});
		}
		
		if(friend.pendingFriends.length > 0) {
			friend.pendingFriends.forEach(pendingFriend => {
				if(pendingFriend.toString() === currentUser._id.toString()) {
					// return res.json({
					// 	isSuccessful: false,
					// 	message: "You have already sent request to this user"
					// });
					return console.log("You have already sent request to this user");
				} else {
					friend.pendingFriends.push(currentUser._id);
				}
			});
		} else {
			friend.pendingFriends.push(currentUser._id);
			// return res.json({
			// 	isSuccessful: true,
			// 	message: `Request was send to ${friend.displayName}`,
			// });
		}
		await friend.save();
		return res.json({
			isSuccessful: true,
			message: `Request was send to ${friend.displayName}`,
		});
	} catch (error) {
		console.log(error);
		res.json({
			isSuccessful: false,
			message: "Something went wrong...",
		});
	}
}

// GET => /friends/your-friends
exports.getYourFriends = async (req, res) => {
	const user = await User.findOne({ profileId: req.user.profileId });
	const users = await User.find({ _id: { $in: user.friends } }).exec();
	res.render("friends/your-friends", {
		user,
		users,
		path: "friends",
		path2: "yourFriends"
	})
}

// GET => /friends/pending-requests
exports.getPendingRequests = async (req, res) => {
	const user = await User.findOne({ profileId: req.user.profileId });
	const users = await User.find({ _id: { $in: user.pendingFriends } }).exec();
	res.render("friends/pending-requests", {
		user,
		users,
		path: "friends",
		path2: "pendingRequests"
	})
}

// POST => /friends/decline-request
exports.postDeclineRequest = async (req, res) => {
	const { userId } = req.body;
	try {
		const user = await User.findOne({ profileId: req.user.profileId });
		user.pendingFriends = user.pendingFriends.filter(item => item.toString() !== userId);
		await user.save();
		res.json({
			isSuccessful: true,
			message: "Request declined",
			data: {
				requestId: `request_${userId}`
			}
		})
	} catch (error) {
		console.log(error);
		res.json({
			isSuccessful: false,
			message: "Something went wrong..."
		});
	}
}

exports.postAcceptRequest = async (req, res) => {
	const { userId } = req.body;
	try {
		const user = await User.findOne({ profileId: req.user.profileId });
		const friend = await User.findOne({ _id: userId });
		friend.friends.push(req.user._id);
		user.friends.push(mongoose.Types.ObjectId(userId));
		user.pendingFriends = user.pendingFriends.filter(item => item.toString() !== userId);
		await user.save();
		await friend.save();
		res.json({
			isSuccessful: true,
			message: "Request accepted",
			data: {
				requestId: `request_${userId}`
			}
		})
	} catch (error) {
		res.json({
			isSuccessful: false,
			message: "Something went wrong..."
		});
		console.log(error);
	}
}