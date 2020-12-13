const postTextArea = document.getElementById("postTextArea");
const postSelectVisibility = document.getElementById("selectPostVisibility");
const postButton = document.getElementById("publishPostButton");
const postsHeader = document.getElementById("postsHeader");	

const socket = io(`/`);

socket.on("connect", () => {
	console.log("Connected to server...");
});

postButton.addEventListener("click", () => {
  const isPublic = postSelectVisibility.value == "Public" ? true : false;
	socket.emit("add-post", {
		isPublic,
		postText: postTextArea.value,
	});
});

socket.on("add-post", (data) => {
	document.getElementById("postsHeader").insertAdjacentHTML("afterEnd", data.htmlNewPostCreator);
});