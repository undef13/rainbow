import { checkGivenName, checkFamilyName, checkEmail, checkPassword, checkPasswordRepeat } from "../common/validity-check-functions.js";
import { alert, makeAjax } from "../common/helper-functions.js";

// Constants
const REGISTER_BEFORE_SEND = "REGISTER_BEFORE_SEND";
const REGISTER_AFTER_SEND = "REGISTER_AFTER_SEND";
const RECOVER_BEFORE_SEND = "RECOVER_BEFORE_SEND";
const RECOVER_AFTER_SEND = "RECOVER_AFTER_SEND";

/* ---------- GETTING DATA ---------- */
const createNewAccountModal = document.getElementById("createNewAccountModal");
const registerForm = document.getElementById("registerForm");
const registerGivenNameInput = document.getElementById("registerGivenNameInput");
const registerFamilyNameInput = document.getElementById("registerFamilyNameInput");
const registerEmailInput = document.getElementById("registerEmailInput");
const registerPasswordInput = document.getElementById("registerPasswordInput");
const registerPasswordRepeatInput = document.getElementById("registerPasswordRepeatInput");

const loginForm = document.getElementById("loginForm");
const loginEmailInput = document.getElementById("loginEmailInput");
const loginPasswordInput = document.getElementById("loginPasswordInput");

const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const forgotPasswordEmailInput = document.getElementById("forgotPasswordEmailInput");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
/* ---------- END OF GETTING DATA ---------- */

/* ---------- DATA VALIDATION FUNCTIONS ---------- */
// Register Form Validation
const registerValidityCheck = () => {
  const registerGivenNameInputValue = registerGivenNameInput.value.trim();
  const registerFamilyNameInputValue = registerFamilyNameInput.value.trim();
  const registerEmailInputValue = registerEmailInput.value.trim();
  const registerPasswordInputValue = registerPasswordInput.value.trim();
  const registerPasswordRepeatInputValue = registerPasswordRepeatInput.value.trim();

  if (
    checkGivenName(registerGivenNameInputValue, registerGivenNameInput) &
    checkFamilyName(registerFamilyNameInputValue, registerFamilyNameInput) &
    checkEmail(registerEmailInputValue, registerEmailInput) &
    checkPassword(registerPasswordInputValue, registerPasswordInput) &
    checkPasswordRepeat(registerPasswordInputValue, registerPasswordRepeatInputValue, registerPasswordRepeatInput)
  ) {
    return true;
  } else {
    return false;
  }
};

// Login Form Validation
const loginValidityCheck = () => {
  let loginEmailInputValue = loginEmailInput.value.trim();
  let loginPasswordInputValue = loginPasswordInput.value.trim();
  if (
    checkEmail(loginEmailInputValue, loginEmailInput) & 
    checkPassword(loginPasswordInputValue, loginPasswordInput)
  ) {
    return true;
  } else {
    return false;
  }
};

// Forgot Password Validation
const forgotPasswordValidityCheck = () => {
  const forgotPasswordEmailInputValue = forgotPasswordEmailInput.value.trim();
  if(checkEmail(forgotPasswordEmailInputValue, forgotPasswordEmailInput)) {
    return true;
  } else {
    return false;
  }
};
/* ---------- END OF DATA VALIDATION FUNCTIONS ---------- */

/* ---------- ACTION HANDLERS ---------- */
// Sign up handler
document.getElementById("signUpButton").addEventListener("click", () => {
	onClickSignUpHandler();
});

// Forgot password handler
document.getElementById("forgotPasswordButton").addEventListener("click", () => {
	onClickForgotPasswordHandler();
});

// Preventing default behavior "Forgot password" link
document.getElementById("forgotPasswordLink").addEventListener("click", (e) => {
	e.preventDefault();
});
/* ---------- END OF ACTION HANDLERS ---------- */

/* ---------- EVENT LISTENERS ---------- */
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

loginForm.addEventListener("submit", (e) => {
  if (!loginValidityCheck()) {
    e.preventDefault();
  }
});

forgotPasswordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  onClickForgotPasswordHandler();
});
/* ---------- END OF EVENT LISTENERS ---------- */

/* ---------- ACTION HANDLERS FUNCTIONS ---------- */
// Sign up handler function
const onClickSignUpHandler = () => {
  const givenName = registerGivenNameInput.value.trim();
  const familyName = registerFamilyNameInput.value.trim();
  const email = registerEmailInput.value.trim();
	const password = registerPasswordInput.value.trim();

	const createAccModal = document.getElementById('createNewAccountModal');
	const modal = bootstrap.Modal.getInstance(createAccModal);

  if (registerValidityCheck()) {
		ajaxAction(REGISTER_BEFORE_SEND);
		makeAjax("/auth/register", {
			givenName, familyName, email, password
		})
		.then(data => {
			if (typeof data === "string") {
          data = JSON.parse(data);
      }
      if (data.isSuccessful) {
				document.getElementById("registerStatusText").classList.add("success");
				document.getElementById("registerStatusText").classList.remove("error");
      } else {
				document.getElementById("registerStatusText").classList.add("error");
				document.getElementById("registerStatusText").classList.remove("success");
			}
			ajaxAction(REGISTER_AFTER_SEND);
			modal.hide();
      alert(data.isSuccessful, data.message);
		});
  }
};

// Forgot password handler function
const onClickForgotPasswordHandler = () => {
  if (forgotPasswordValidityCheck()) {
		const email = forgotPasswordEmailInput.value.trim();

		const recoverPassModal = document.getElementById('forgotPasswordModal');
		const modal = bootstrap.Modal.getInstance(recoverPassModal);

		ajaxAction(RECOVER_BEFORE_SEND);
		makeAjax("/auth/forgot", { email })
		.then(data => {
			if (typeof data === "string") {
				data = JSON.parse(data);
			}
			if (data.isSuccessful) {
				document.getElementById("registerStatusText").classList.add("success");
				document.getElementById("registerStatusText").classList.remove("error");
			} else {
				document.getElementById("registerStatusText").classList.add("error");
				document.getElementById("registerStatusText").classList.remove("success");
			}
			ajaxAction(RECOVER_AFTER_SEND);
			modal.hide();
			alert(data.isSuccessful, data.message);
		});
  }
};
/* ---------- END OF ACTION HANDLERS FUNCTIONS ---------- */

const ajaxAction = (action) => {
	const registerElements = createNewAccountModal.querySelectorAll("input, button");
	const recoverElements = forgotPasswordModal.querySelectorAll("input, button");
	switch (action) {
		case REGISTER_BEFORE_SEND:
			for(let element of registerElements) {
				element.disabled = true;
			}
			createNewAccountModal.querySelector(".spinner").hidden = false;
			createNewAccountModal.querySelector(".status-text").hidden = true;
			break;
		case REGISTER_AFTER_SEND:
			for(let element of registerElements) {
				element.disabled = false;
			}
			createNewAccountModal.querySelector(".spinner").hidden = true;
			createNewAccountModal.querySelector(".status-text").hidden = false;
			// close modal
			break;
		case RECOVER_BEFORE_SEND:
			for(let element of recoverElements) {
				element.disabled = true;
			}
			forgotPasswordModal.querySelector(".spinner").hidden = false;
			forgotPasswordModal.querySelector(".status-text").hidden = true;
			break;
		case RECOVER_AFTER_SEND:
			for(let element of recoverElements) {
				element.disabled = false;
			}
			forgotPasswordModal.querySelector(".spinner").hidden = true;
			forgotPasswordModal.querySelector(".status-text").hidden = false;
			//hide modal
			break;
	}
}