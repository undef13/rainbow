// "use strict";

// Automatic textarea
const elements = document.querySelectorAll("textarea");
for(let element of elements) {
	element.addEventListener("input", () => {
		element.style.height = "1px";
		element.style.height = (element.scrollHeight + 1) + "px";
	});
}

// /* --------- ADD POST --------- */
// // const postTextArea = document.getElementById("postTextArea");
// // const postSelectVisibility = document.getElementById("selectPostVisibility");
// // const postButton = document.getElementById("publishPostButton");
// // const postsHeader = document.getElementById("postsHeader");

// postButton.addEventListener("click", () => {
//   const isPublic = postSelectVisibility.value == "Public" ? true : false;
//   disableInputs(true);
//   makeAjax("/add-post", {
//     isPublic,
//     postText: postTextArea.value,
//   }).then((data) => {
// 		document.querySelector("#publishPostButton > .spinner").setAttribute("hidden", "hidden");
// 		postTextArea.value = "";
// 		postsHeader.insertAdjacentHTML("afterEnd", data.data.htmlNewPost);
// 		disableInputs(false);
//   });
// });

// const disableInputs = (disable) => {
// 	if (disable) {
// 		postButton.setAttribute("disabled", "disabled");
// 		postSelectVisibility.setAttribute("disabled", "disabled");
// 		document
// 			.querySelector("#publishPostButton > .spinner")
// 			.removeAttribute("hidden", "hidden");
// 	} else {
// 		postButton.removeAttribute("disabled", "disabled");
// 		postSelectVisibility.removeAttribute("disabled", "disabled");
// 		document
// 			.querySelector("#publishPostButton > .spinner")
// 			.setAttribute("hidden", "hidden");
// 	}
// };

// const checkPostTextAreaText = () => {
//   if (postTextArea.value === "") {
//     postButton.setAttribute("disabled", "disabled");
//   } else {
//     postButton.removeAttribute("disabled");
//   }
// };
// /* --------- END OF ADD POST --------- */

// // EDIT AND DELETE POST CONTROLLER
// const postsControls = (postId, action) => {
// 	postId = postId.split("_")[1];
//   switch (action) {
//     case "deletePost":
//       deletePost(postId);
// 			break;
// 		case "cancelEditing":
// 			cancelEditing(postId);
// 			break;
//     case "editPost":
//       editPost(postId);
// 			break;
// 		case "savePost":
// 			savePost(postId);
// 			break;
//   }
// };
// /* --------- DELETE POST --------- */
// const deletePost = (postId) => {
//   makeAjax("/delete-post", { postId }).then((data) => {
// 		document.getElementById(`post_${data.data.postId}`).remove();
//   });
// };

// const makeAjax = async (url = "", data = {}) => {
//   const response = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });

//   return response.json();
// };
// /* --------- END OF DELETE POST --------- */

// /* --------- EDIT POST --------- */

// const savePost = (postId) => {
// 	const postContainer = document.querySelector(`#post_${postId}`);
// 	const editText = postContainer.querySelector(`#newPostTextArea`);
// 	const selectVisibility = postContainer.querySelector(`select`);
// 	const buttons = postContainer.querySelectorAll(`button`);

// 	for(const button of buttons) {
// 		button.setAttribute("disabled", "disabled");
// 	}
// 	selectVisibility.setAttribute("disabled", "disabled");
// 	postContainer.querySelector(".spinner").removeAttribute("hidden", "hidden");

// 	makeAjax("/edit-post", 
// 	{ newPostText: editText.value,
// 		isVisible: selectVisibility.value,
// 		postId
// 	})
// 	.then(data => {
// 		for(const button of buttons) { 
// 			button.removeAttribute("disabled", "disabled");
// 		}
// 		selectVisibility.removeAttribute("disabled", "disabled");
// 		postContainer.querySelector(".spinner").setAttribute("hidden", "hidden");
// 		showEditingControls(postId, false);

// 		postContainer.querySelector(".postText").textContent = data.data.postText;
// 		postContainer.querySelector(".post-visibility").textContent = data.data.isPublic;
// 	});
// }

// const editPost = (postId) => {
// 	showEditingControls(postId, true);
// }

// const cancelEditing = (postId) => {
// 	showEditingControls(postId, false);
// }

// const showEditingControls = (postId, show) => {
// 	const postContainer = document.querySelector(`#post_${postId}`);
// 	const editControls = postContainer.querySelector(`.editPostControlsContainer`);
// 	const postInfo = postContainer.querySelector(`.postDataContainer`);
// 	const textContainer = postContainer.querySelector(`.postText`);
// 	const editTextContainer = postContainer.querySelector(`.editPostTextAreaContainer`);
// 	if (show) {
// 		editTextContainer.querySelector("textarea").value = textContainer.textContent.trim();
// 		editControls.style.setProperty("display", "");
// 		postInfo.style.setProperty("display", "none", "important");
// 		textContainer.style.setProperty("display", "none");
// 		editTextContainer.style.setProperty("display", "block");
// 	} else {
// 		editControls.style.setProperty("display", "none", "important");
// 		postInfo.style.setProperty("display", "");
// 		textContainer.style.setProperty("display", "block");
// 		editTextContainer.style.setProperty("display", "none");
// 	}
// }
// /* --------- END OF EDIT POST --------- */