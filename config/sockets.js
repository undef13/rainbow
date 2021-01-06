const User = require("../models/User");
const mongoose = require("mongoose");
const ejs = require(`ejs`);

module.exports = (io) => {
  io.on("connection", (socket) => {
    const userId = mongoose.Types.ObjectId(
      socket.request.session.passport.user
    );
    socket.join(`${userId}`);

    socket.on("friend-request", (data) => {
      socket
        .to(data.userId)
        .emit("notification", {
          requestsCounter: data.requestsCounter,
          notificationHtml: data.notificationHtml,
        });
    });

    // POSTS LOGIC
    socket.on("add-post-server", async (data) => {
      const _id = mongoose.Types.ObjectId();
      const newPost = {
        _id,
        postText: data.postText,
        publicationDate: new Date(),
        isPublic: data.isPublic,
      };
      try {
        const user = await User.findById(userId);
        user.posts.push(newPost);
        await user.save();

        const htmlNewPostCreator = ejs.render(newPostCreator, {
          user,
          newPost,
        });
        const htmlNewPostWatcher = ejs.render(newPostWatcher, {
          user,
          newPost,
        });

        io.sockets.emit(`add-post-client`, {
          htmlNewPostCreator,
          htmlNewPostWatcher,
          profileId: user.profileId,
          isPublic: newPost.isPublic,
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("delete-post-server", async (data) => {
      const postId = data.postId.split("_")[1];
      try {
        const user = await User.findById(userId);
        user.posts = user.posts.filter(
          (post) => post._id.toString() !== postId
        );
        await user.save();
        io.sockets.emit("delete-post-client", {
          postId: `post_${postId}`,
          profileId: user.profileId,
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("edit-post-server", async (data) => {
      const postId = data.postId.split("_")[1];
      try {
        const user = await User.findById(userId);
        user.posts = user.posts.map((post) => {
          if (post._id.toString() == postId.toString()) {
            post.postText = data.newPostText;
            post.isPublic = data.isVisible == "Public" ? true : false;
          }
          return post;
        });
        await user.save();
        io.sockets.emit("edit-post-client", {
          postId: `post_${postId}`,
          postText: data.newPostText,
          isVisible: data.isVisible,
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
};

const newPostCreator = `<div id="post_<%= newPost._id %>" class="wrapper post">
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
			data-bs-toggle="dropdown"
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
<div class="text-justify postText text-break">
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
</div>`;
const newPostWatcher = `<div id="post_<%= newPost._id %>" class="wrapper post">
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
</div>
<%# Post Body %>
<div class="text-justify postText text-break">
<%= newPost.postText %>
</div>
<hr />
<%# Post Footer %>
<div class="post-footer">
<div class="d-flex justify-content-start postDataContainer">
	<div>Rainbow</div>
</div>
</div>
</div>`;
