import { alert, makeAjax } from "../common/helper-functions.js";

/* ----------- GETTING DATA ----------- */
const bioTextArea = document.getElementById("bioTextArea");
const bioSaveButton = document.getElementById("bioSaveButton");
const bioContainer = document.getElementById("bioContainer");
const bioModal = document.getElementById("bioModal");
/* ----------- END OF GETTING DATA ----------- */

// Initial Value
let initialBioText = bioTextArea.value.trim();

/* ----------- EVENT LISTENERS ----------- */
bioSaveButton.addEventListener("click", () => {
	ajaxAction("BEFORE_SEND");
  makeAjax("/settings/bio", {
		bio: bioTextArea.value.trim()
	}).then(data => {
		let newBioText = data.data.bio;
		initialBioText = newBioText;
		if (newBioText == "") {
			bioContainer.textContent = "None";
		} else if(newBioText.length > 35) {
			bioContainer.textContent = `${newBioText.slice(0, 35)}...`;
		} else {
			bioContainer.textContent = newBioText;
		}
		ajaxAction("AFTER_SEND");
		alert(data.isSuccessful, data.message);
	});
});

document.getElementById("bio-wrapper").addEventListener("click", () => {
	symbolsLeft();
});

document.getElementById("bioTextArea").addEventListener("input", () => {
	symbolsLeft();
});
/* ----------- END OF EVENT LISTENERS ----------- */

const symbolsLeft = () => {
	let charactersLeft = bioTextArea.maxLength - bioTextArea.value.length;
	document.querySelector(".characters-left").textContent = charactersLeft;
	checkTextAreaForChanges();
}

const checkTextAreaForChanges = () => {
  if (bioTextArea.value.trim() == initialBioText) {
    bioSaveButton.disabled = true;
  } else {
    bioSaveButton.disabled = false;
  }
};

const ajaxAction = (action) => {
	const elements = bioModal.querySelectorAll("button, textarea");
	switch (action) {
		case "BEFORE_SEND":
			for(let element of elements) {
				element.disabled = true;
			}
			bioModal.querySelector(".spinner").hidden = false;
			bioModal.querySelector(".button-text").hidden = true;
			break;
		case "AFTER_SEND":
			for(let element of elements) {
				element.disabled = false;
			}	
			bioModal.querySelector(".spinner").hidden = true;
			bioModal.querySelector(".button-text").hidden = false;
			checkTextAreaForChanges();
			const modal = bootstrap.Modal.getInstance(bioModal);
			modal.hide();
			break;
	}
}