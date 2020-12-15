const socket = io(`/`);

const postsControls = (postId, action) => {
  switch (action) {
    case "deletePost":
      deletePost(postId);
      break;
    case "cancelEditing":
      cancelEditing(postId);
      break;
    case "editPost":
      editPost(postId);
      break;
    case "savePost":
      savePost(postId);
      break;
  }
};

/* --------- DELETING POST --------- */
const deletePost = (postId) => {
  socket.emit("delete-post-server", { postId });
};

socket.on("delete-post-client", (data) => {
  if (document.location.pathname.slice(1) == data.profileId) {
    document.getElementById(data.postId).remove();
  }
});
/* --------- END OF DELETING POST --------- */

/* --------- ADDING POST --------- */
const postTextArea = document.getElementById("postTextArea");
const postSelectVisibility = document.getElementById("selectPostVisibility");
const postButton = document.getElementById("publishPostButton");
const postsHeader = document.getElementById("postsHeader");

postButton.addEventListener("click", () => {
  const isPublic = postSelectVisibility.value == "Public" ? true : false;
  disableAddingInputs(true);
  socket.emit("add-post-server", {
    isPublic,
    postText: postTextArea.value,
  });
});

socket.on("add-post-client", (data) => {
  disableAddingInputs(false);
  postTextArea.value = "";
  if (document.location.pathname.slice(1) == data.profileId) {
    document
      .getElementById("postsHeader")
      .insertAdjacentHTML("afterEnd", data.htmlNewPostCreator);
  }
});

// Disable all adding inputs & buttons
const disableAddingInputs = (disable) => {
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
/* --------- END OF ADDING POST --------- */

/* --------- EDITING POST --------- */
// Edit button click
const editPost = (postId) => {
  showEditingControls(postId, true);
};

// Cancel editing button click
const cancelEditing = (postId) => {
  showEditingControls(postId, false);
};

// Save changes button click
const savePost = (postId) => {
  const postContainer = document.getElementById(postId);
  const editText = postContainer.querySelector(`#newPostTextArea`);
  const selectVisibility = postContainer.querySelector(`select`);
	const buttons = postContainer.querySelectorAll(`button`);
	
  for (const button of buttons) {
    button.setAttribute("disabled", "disabled");
  }
  selectVisibility.setAttribute("disabled", "disabled");
  postContainer.querySelector(".spinner").removeAttribute("hidden", "hidden");

  socket.emit("edit-post-server", {
    newPostText: editText.value,
    isVisible: selectVisibility.value,
    postId,
  });
};

socket.on("edit-post-client", (data) => {
  const postContainer = document.getElementById(data.postId);
  if (postContainer) {
    const selectVisibility = postContainer.querySelector(`select`);
    const buttons = postContainer.querySelectorAll(`button`);
    for (const button of buttons) {
      button.removeAttribute("disabled", "disabled");
    }
    selectVisibility.removeAttribute("disabled", "disabled");
    postContainer.querySelector(".spinner").setAttribute("hidden", "hidden");
    showEditingControls(data.postId, false);

    postContainer.querySelector(".postText").textContent = data.postText;
    postContainer.querySelector(".post-visibility").textContent = data.isVisible;
  }
});

// Showing editing controls or no
const showEditingControls = (postId, show) => {
  const postContainer = document.getElementById(postId);
  const editControls = postContainer.querySelector(`.editPostControlsContainer`);
  const postInfo = postContainer.querySelector(`.postDataContainer`);
  const textContainer = postContainer.querySelector(`.postText`);
  const editTextContainer = postContainer.querySelector(`.editPostTextAreaContainer`);
  if (show) {
		postContainer.querySelector("hr").style.setProperty("border-color", "#007BFF", "important");
    editTextContainer.querySelector("textarea").value = textContainer.textContent.trim();
    editControls.style.setProperty("display", "");
    postInfo.style.setProperty("display", "none", "important");
    textContainer.style.setProperty("display", "none");
    editTextContainer.style.setProperty("display", "block");
  } else {
		postContainer.querySelector("hr").style.setProperty("border-color", "", "important");
    editControls.style.setProperty("display", "none", "important");
    postInfo.style.setProperty("display", "");
    textContainer.style.setProperty("display", "block");
    editTextContainer.style.setProperty("display", "none");
  }
};
/* --------- END OF EDITING POST --------- */