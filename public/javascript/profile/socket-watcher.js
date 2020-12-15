const socket = io(`/`);

socket.on("add-post-client", (data) => {
  console.log("asd");
  if (data.isPublic && document.location.pathname.slice(1) == data.profileId) {
    document
      .getElementById("postsHeader")
      .insertAdjacentHTML("afterEnd", data.htmlNewPostWatcher);
  }
});

socket.on("delete-post-client", (data) => {
  const post = document.getElementById(data.postId);
  if (post) {
    document.getElementById(data.postId).remove();
  }
});

socket.on("edit-post-client", (data) => {
  const post = document.getElementById(data.postId);
  if (post) {
		if(data.isVisible == "Private") {
			post.remove();
		} else {
			post.querySelector(".postText").textContent = data.postText;
		}
  }
});
