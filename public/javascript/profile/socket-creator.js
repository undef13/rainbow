const postTextArea = document.getElementById("postTextArea");
const postSelectVisibility = document.getElementById("selectPostVisibility");
const postButton = document.getElementById("publishPostButton");
const postsHeader = document.getElementById("postsHeader");	

const socket = io(`/`);

const postsControls = (postId, action) => {
	postId = postId.split("_")[1];
  switch (action) {
    case "deletePost":
      deletePost(postId);
			break;
		// case "cancelEditing":
		// 	cancelEditing(postId);
		// 	break;
    // case "editPost":
    //   editPost(postId);
		// 	break;
		// case "savePost":
		// 	savePost(postId);
		// 	break;
  }
};
const deletePost = (postId) => {
	socket.emit("delete-post-server", {
		postId
	});
}

socket.on("connect", () => {
	console.log("Connected to server...");
});

postButton.addEventListener("click", () => {
	const isPublic = postSelectVisibility.value == "Public" ? true : false;
	disableInputs(true);
	socket.emit("add-post-server", {
		isPublic,
		postText: postTextArea.value,
	});
});

socket.on("add-post-client", (data) => {
	disableInputs(false);
	postTextArea.value = "";
	if(document.location.pathname.slice(1) == data.profileId) {
		document.getElementById("postsHeader").insertAdjacentHTML("afterEnd", data.htmlNewPostCreator);
	}
});

socket.on("delete-post-client", (data) => {
	if(document.location.pathname.slice(1) == data.profileId) {
		document.getElementById(data.postId).remove();
	}
})

const disableInputs = (disable) => {
	if (disable) {
		postTextArea.setAttribute("disabled", "disabled");
		postButton.setAttribute("disabled", "disabled");
		postSelectVisibility.setAttribute("disabled", "disabled");
		document
			.querySelector("#publishPostButton > .spinner")
			.removeAttribute("hidden", "hidden");
	} else {
		postTextArea.removeAttribute("disabled", "disabled");
		postButton.removeAttribute("disabled", "disabled");
		postSelectVisibility.removeAttribute("disabled", "disabled");
		document
			.querySelector("#publishPostButton > .spinner")
			.setAttribute("hidden", "hidden");
	}
};