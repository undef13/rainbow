import { checkGivenName, checkFamilyName } from "../common/validity-check-functions.js";
import { alert, makeAjax } from "../common/helper-functions.js";

/* ----------- GETTING DATA ----------- */
const givenNameInput = document.getElementById("givenNameInput");
const familyNameInput = document.getElementById("familyNameInput");
const genderSaveButton = document.getElementById("nameSaveButton");
const displayNameModal = document.getElementById("displayNameModal");
/* ----------- END OF GETTING DATA ----------- */

// Initial values
let initialGivenName = givenNameInput.value.trim();
let initialFamilyName = familyNameInput.value.trim();

/* ----------- CHECK INPUTS FOR CHANGES ----------- */
const checkInputsForChanges = () => {
  if (
    givenNameInput.value.trim() == initialGivenName &&
    familyNameInput.value.trim() == initialFamilyName
  ) {
    genderSaveButton.disabled = true;
  } else {
    genderSaveButton.disabled = false;
  }
};
/* ----------- END OF CHECK INPUTS FOR CHANGES ----------- */

/* ----------- ACTION HANDLERS ----------- */
document.getElementById("name-wrapper").addEventListener("click", () => {
	checkInputsForChanges();
});

// Click on "Save" button in the name form
genderSaveButton.addEventListener("click", () => {
  onSubmitButtonClick();
});

/* ----------- END OF ACTION HANDLERS ----------- */

/* ----------- ACTION HANDLERS FUNCTIONS ----------- */
const onSubmitButtonClick = () => {
  if (formNameValidation()) {
		ajaxAction("BEFORE_SEND");
    makeAjax("/settings/display-name", {
			givenName: givenNameInput.value.trim(),
      familyName: familyNameInput.value.trim()
		}).then(data => {
			document.getElementById("displayNameContainer").textContent = data.data.displayName;
			document.getElementById("displayNameSpan").textContent = data.data.displayName;
      initialGivenName = data.data.givenName;
			initialFamilyName = data.data.familyName;
			ajaxAction("AFTER_SEND");
			checkInputsForChanges();
      alert(data.isSuccessful, data.message);
		});
  }
};

const ajaxAction = (action) => {
	const elements = displayNameModal.querySelectorAll("button, input");
	switch (action) {
		case "BEFORE_SEND":
			for(let element of elements) {
				element.disabled = true;
			}
			displayNameModal.querySelector(".spinner").hidden = false;
			displayNameModal.querySelector(".button-text").hidden = true;
			break;
		case "AFTER_SEND":
			for(let element of elements) {
				element.disabled = false;
			}
			displayNameModal.querySelector(".spinner").hidden = true;
			displayNameModal.querySelector(".button-text").hidden = false;
			const formGroups = displayNameModal.querySelectorAll(".form-group");
			for(let formGroup of formGroups) {
				formGroup.classList.remove("success");
			}
			break;
	}
}
/* ----------- END OF ACTION HANDLERS FUNCTIONS ----------- */

/* ----------- FUNCTIONS FOR VALIDATION FORMS ----------- */
// Name Form
const formNameValidation = () => {
  const givenName = givenNameInput.value.trim();
  const familyName = familyNameInput.value.trim();
  if (
    checkGivenName(givenName, givenNameInput) &
    checkFamilyName(familyName, familyNameInput)
  ) {
    return true;
  } else {
    return false;
  }
};
/* ----------- END OF FUNCTIONS FOR VALIDATION FORMS ----------- */

/* ----------- ADDING EVENT LISTENERS ----------- */
givenNameInput.addEventListener("input", () => checkInputsForChanges());
familyNameInput.addEventListener("input", () => checkInputsForChanges());
/* ----------- END OF ADDING EVENT LISTENERS ----------- */
