import {
  checkPassword,
  checkPasswordRepeat,
} from "../common/validity-check-functions.js";
import { alert, makeAjax } from "../common/helper-functions.js";

/* ----------- GETTING DATA ----------- */
const currentPassword = document.getElementById("currentPasswordInput");
const newPassword = document.getElementById("newPasswordInput");
const repeatNewPassword = document.getElementById("repeatNewPasswordInput");

const changePasswordModal = document.getElementById("changePasswordModal");
/* ----------- END OF GETTING DATA ----------- */

/* ----------- ACTION HANDLERS ----------- */

document.getElementById("changePasswordSaveButton").addEventListener("click", () => {
	onSubmitButtonClick();
});

/* ----------- END OF ACTION HANDLERS ----------- */

/* ----------- ACTION HANDLERS FUNCTIONS ----------- */

const onSubmitButtonClick = () => {
  if (dataValidation()) {
		ajaxAction("BEFORE_SEND");
    makeAjax("/settings/change-password", {
			currentPassword: currentPassword.value.trim(),
			newPassword: newPassword.value.trim(),
		}).then(data => {
			if (data.data) {
				document.getElementById("changePasswordContainer")
					.textContent = `Last changed ${data.data.lastChangePassword}`;
			}
			ajaxAction("AFTER_SEND");
      alert(data.isSuccessful, data.message);
		});
  }
}

const dataValidation = () => {
  if (
    checkPassword(currentPassword.value.trim(), currentPassword) &
    checkPassword(newPassword.value.trim(), newPassword) &
    checkPasswordRepeat(newPassword.value.trim(), repeatNewPassword.value.trim(), repeatNewPassword)
  ) {
    return true;
  } else {
    return false;
  }
};

const ajaxAction = (action) => {
	const elements = document.querySelectorAll("input, button");
	switch (action) {
		case "BEFORE_SEND":
			for(let element of elements) {
				element.disabled = true;
			}
			changePasswordModal.querySelector(".spinner").hidden = false;
			changePasswordModal.querySelector(".button-text").hidden = true;
			break;
		case "AFTER_SEND":
			for(let element of elements) {
				element.disabled = false;
			}
			changePasswordModal.querySelector(".spinner").hidden = true;
			changePasswordModal.querySelector(".button-text").hidden = false;
			const formGroups = changePasswordModal.querySelectorAll(".form-group");
			const inputs = changePasswordModal.querySelectorAll("input");
			for(let formGroup of formGroups) {
				formGroup.classList.remove("success");
			}
			for(let input of inputs) {
				input.value = "";
			}
			break;
	}
}
/* ----------- END OF ACTION HANDLERS FUNCTIONS ----------- */