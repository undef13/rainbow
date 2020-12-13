// Dependencies
const ejs = require(`ejs`);
const mongoose = require(`mongoose`);

// User Model
const User = require(`../models/User`);

// GET => /
exports.getIndex = (req, res) => {
  res.render("start-page/start-page", {
		// errors: req.flash("error"),
		errors: []
  });
};

// GET => /about
exports.getAbout = (req, res) => {
	res.render("about-page/about", {
		user: req.user,
		path: ""
	});
}

// GET => /:profileId
exports.getProfileId = async (req, res, next) => {
  const profileId = req.params.profileId;
  if (req.user.profileId === profileId) {
    res.render("profile/profile", {
      title: req.user.displayName,
      user: req.user,
      path: "profileId",
    });
  } else {
    try {
      const user = await User.findOne({ profileId });
      if (!user) {
        console.log(`User with id '${req.params.profileId}' was not found`);
        return next();
			}
			const posts = user.posts.filter(post => post.isPublic === true);

      res.render("profile/watch-profile", {
        title: user.displayName,
        user: user,
				currentUser: req.user,
				posts,
        path: "",
      });
    } catch (error) {
      console.log(error);
    }
  }
};

// POST => /add-post
exports.postAddPost = async (req, res) => {
	const { isPublic, postText } = req.body;
	const _id = mongoose.Types.ObjectId();
  const newPost = {
		_id,
    postText,
    publicationDate: new Date(),
    isPublic,
	};
	
  try {
    const user = await User.findOne({ profileId: req.user.profileId });
    user.posts.push(newPost);
    await user.save();
		const htmlNewPost = ejs.render(`
		<div id="post_<%= newPost._id %>" class="wrapper post">
			<%# Post Header %>
			<div class="d-flex justify-content-between post-header">
				<%# Writer Details %>
				<div class="d-flex justify-content-start post-creator-container">
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
					<%=
						newPost.publicationDate.toLocaleDateString("en-US",
						{ year: 'numeric', month: 'long', day: 'numeric', hour:
						'numeric', minute: "numeric" }) 
					%>
				</div>
			</div>
		</div>
	
			<%# Actions Dropdown %>
			<div class="dropdown">
				<button
					class="btn btn-sm dropdown-toggle"
					type="button"
					data-toggle="dropdown"
					aria-haspopup="true"
					aria-expanded="false"
				>
					<i class="fas fa-chevron-down"></i>
				</button>
				<div class="dropdown-menu dropdown-menu-right">
						<button onclick="postsControls('post_<%= newPost._id %>', 'deletePost')" class="dropdown-item">Delete</button>
						<button onclick="postsControls('post_<%= newPost._id %>', 'editPost')" class="dropdown-item">Edit</button>
				</div>
			</div>

		</div>

		<%# Post Body %>
		<div class="text-justify postText">
			<%= newPost.postText %>
		</div>

		<div style="display: none;" class="editPostTextAreaContainer">
			<textarea id="newPostTextArea" class="textarea" rows="1"></textarea>
		</div>

		<hr />
		<%# Post Footer %>
		<div class="post-footer">
			
			<div style="display: none !important;" class="d-flex justify-content-between editPostControlsContainer">
				<div>

					<button onclick="postsControls('post_<%= newPost._id %>', 'savePost')" class="btn btn-sm btn-primary saveButton">
						<span
							class="spinner spinner-border spinner-border-sm"
							role="status"
							aria-hidden="true"
							hidden
						></span>
						<span class="status-text">Save</span>
					</button>

					<button	class="btn btn-sm btn-secondary" onclick="postsControls('post_<%= newPost._id %>', 'cancelEditing')">
						<span class="status-text">Cancel</span>
					</button>

				</div>
				
				<select class="form-control-sm w-25">
					<option selected>Public</option>
					<option>Private</option>
				</select>
			</div>

			<div class="d-flex justify-content-between postDataContainer">
				<div>Rainbow</div>
				<div class="post-visibility">
					<%= newPost.isPublic ? "Public" : "Private" %>
				</div>
			</div>

		</div>
	</div>`, { user, newPost });
    res.json({
      isSuccessful: true,
      data: {
        htmlNewPost,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      isSuccessful: false,
      message: "Something went wrong...",
    });
  }
};

// POST => /delete-post
exports.postDeletePost = async (req, res) => {
	const { postId } = req.body;
  try {
    const user = await User.findOne({ profileId: req.user.profileId });
    user.posts = user.posts.filter(
      (post) => post._id.toString() !== postId.toString()
    );
    await user.save();
    res.json({
      isSuccessful: true,
      message: "Operation successful",
      data: {
        postId,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      isSuccessful: false,
      message: "Something went wrong...",
    });
  }
};

// POST => /edit-post
exports.postEditPost = async (req, res) => {
	const { newPostText, isVisible, postId } = req.body;
	console.log(req.body);
	try {
		const user = await User.findOne({ profileId: req.user.profileId });

		user.posts = user.posts.map(post => {
			if(post._id.toString() == postId.toString()) {
				post.postText = newPostText;
				post.isPublic = isVisible == "Public" ? true : false;
			}
			return post;
		});
		await user.save();

		res.json({
			isSuccessful: true,
			message: "Success",
			data: {
				postText: newPostText,
				isPublic: isVisible
			}
		});
	} catch (error) {
		console.log(error);
		res.json({
			isSuccessful: false,
			message: "Something went wrong..."
		});
	}

}