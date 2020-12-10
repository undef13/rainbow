"use strict";

const postTextArea = document.getElementById("postTextArea");
const postSelectVisibility = document.getElementById("selectPostVisibility");
const postButton = document.getElementById("publishPostButton");
const postsHeader = document.getElementById("postsHeader");

postButton.addEventListener("click", () => {
  const isPublic = postSelectVisibility.value == "Public" ? true : false;
  disableInputs(true);
  makeAjax("/add-post", {
    isPublic,
    postText: postTextArea.value,
  }).then((data) => {
    document.querySelector("#publishPostButton > .spinner").setAttribute("hidden", "hidden");
		postTextArea.value = "";
		postsHeader.insertAdjacentHTML("afterEnd", data.data.htmlNewPost);
		disableInputs(false);
  });
});

const disableInputs = (disable) => {
	if (disable) {
		postButton.setAttribute("disabled", "disabled");
		postSelectVisibility.setAttribute("disabled", "disabled");
		document
			.querySelector("#publishPostButton > .spinner")
			.removeAttribute("hidden", "hidden");
	} else {
		postButton.removeAttribute("disabled", "disabled");
		postSelectVisibility.removeAttribute("disabled", "disabled");
		document
			.querySelector("#publishPostButton > .spinner")
			.setAttribute("hidden", "hidden");
	}
};

const checkPostTextAreaText = () => {
  if (postTextArea.value === "") {
    postButton.setAttribute("disabled", "disabled");
  } else {
    postButton.removeAttribute("disabled");
  }
};


// EDIT AND DELETE POSTS
const postsControls = (postId, action) => {
  switch (action) {
    case "deletePost":
      deletePost(postId);
      console.log(`Delete Post Action for Post with id: ${postId}`);
      break;
    case "editPost":
      console.log(`Edit Post Action for Post with id: ${postId}`);
      break;
  }
};

const deletePost = (postId) => {
  makeAjax("/delete-post", { postId }).then((data) => {
    document.getElementById(data.data.postId).remove();
  });
};

const makeAjax = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
};
