import { alert, makeAjax } from "../common/helper-functions.js";

/* ----------- GETTING DATA ----------- */
const selectGender = document.getElementById("selectGender");
const genderSaveButton = document.getElementById("genderSaveButton");
const genderModal = document.getElementById("genderModal");
/* ----------- END OF GETTING DATA ----------- */

// Initial value
let initialGender = selectGender.value;

/* ----------- ACTION HANDLERS ----------- */

genderSaveButton.addEventListener("click", () => {
	ajaxAction("BEFORE_SEND");
	makeAjax("/settings/gender", { gender: selectGender.value }).then(data => {
		document.getElementById("genderContainer").textContent = data.data.gender;
		initialGender = data.data.gender;
		alert(data.isSuccessful, data.message);
		ajaxAction("AFTER_SEND");
	})
});

document.getElementById("gender-wrapper").addEventListener("click", () => {
	checkGenderForChanges();
});

selectGender.addEventListener("change", () => {
	checkGenderForChanges();
});
/* ----------- END OF ACTION HANDLERS ----------- */

/* ----------- ACTION HANDLERS FUNCTIONS ----------- */

const ajaxAction = (action) => {
	const elements = genderModal.querySelectorAll("button, select");
	switch(action) {
		case "BEFORE_SEND":
			for(let element of elements) {
				element.disabled = true;
			}
			genderModal.querySelector(".spinner").hidden = false;
			genderModal.querySelector(".button-text").hidden = true;
			break;
		case "AFTER_SEND":
			for(let element of elements) {
				element.disabled = false;
			}
			genderModal.querySelector(".spinner").hidden = true;
			genderModal.querySelector(".button-text").hidden = false;
			checkGenderForChanges();
			break;
	}
}

const checkGenderForChanges = () => {
    if (selectGender.selectedIndex == 0) {
        return genderSaveButton.disabled = true;
    }
    if(initialGender == selectGender.value) {
			genderSaveButton.disabled = true;
    } else {
			genderSaveButton.disabled = false
    }
}

/* ----------- END OF ACTION HANDLERS FUNCTIONS ----------- */