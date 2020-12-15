const socket = io(`/`);

socket.on("add-post-client", (data) => {
  console.log("asd");
  if (data.isPublic && document.location.pathname.slice(1) == data.profileId) {
    document
      .getElementById("postsHeader")
      .insertAdjacentHTML("afterEnd", data.htmlNewPostWatcher);
	}
	checkForPosts();
});

socket.on("delete-post-client", (data) => {
  const post = document.getElementById(data.postId);
  if (post) {
    document.getElementById(data.postId).remove();
	}
	checkForPosts();
});

socket.on("edit-post-client", (data) => {
  const post = document.getElementById(data.postId);
  if (post) {
		if(data.isVisible == "Private") {
			post.setAttribute("hidden", "hidden");
		} else if(data.isVisible == "Public") {
			post.removeAttribute("hidden", "hidden");
		}	else {
			post.querySelector(".postText").textContent = data.postText;
		}
  }
});

const checkForPosts = () => {
	if(document.querySelectorAll(".post").length <= 0) {
		document.getElementById("haveNoPostsBlock").removeAttribute("hidden", "hidden");
	} else {
		document.getElementById("haveNoPostsBlock").setAttribute("hidden", "hidden");
	}
}
