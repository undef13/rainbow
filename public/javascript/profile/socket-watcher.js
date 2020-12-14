const socket = io(`/`);

socket.on("connect", () => {
	console.log("Connected to server...");
});

socket.on("add-post-client", (data) => {
	if (data.isPublic) {
		document.getElementById("postsHeader").insertAdjacentHTML("afterEnd", data.htmlNewPostWatcher);
	}
});

socket.on("delete-post-client", (data) => {
	if (data.isPublic) {
		document.getElementById(data.postId).remove();
	}
});
