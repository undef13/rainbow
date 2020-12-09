"use strict";

const postTextArea = document.getElementById("postTextArea");
const postSelectVisibility = document.getElementById("selectPostVisibility");
const postButton = document.getElementById("postButton");

const makePostAjax = async (url = "", data = {}) => {
  // postButton.setAttribute("disabled", "disabled");
  // document
  //   .querySelector("#postButton > .spinner")
  //   .removeAttribute("hidden", "hidden");

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json();
};

const checkPostTextAreaText = () => {
  if (postTextArea.value === "") {
    postButton.setAttribute("disabled", "disabled");
  } else {
    postButton.removeAttribute("disabled");
  }
};

postTextArea.addEventListener("input", () => {
  checkPostTextAreaText();
});

postButton.addEventListener("click", () => {
  // const isPublic = postSelectVisibility.value === "Public" ? true : false;
  // makePostAjax("/add-post", {
  //   isPublic: isPublic,
  //   postText: postTextArea.value,
  // }).then((data) => {
  //   // postButton.removeAttribute("disabled");
  //   // document
  //   //   .querySelector("#postButton > .spinner")
  //   //   .setAttribute("hidden", "hidden");
	// 	// postTextArea.value = "";
	// 	// location.href = location.href;
	// 	console.log(data);
  // });
});