import { checkGivenName, checkFamilyName, checkEmail, checkPassword, checkPasswordRepeat } from "../common/validity-check-functions.js";

/* ---------- GETTING DATA ---------- */
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
$("#signUpButton").on("click", () => {
  onClickSignUpHandler();
});

// Forgot password handler
$("#forgotPasswordButton").on("click", () => {
  onClickForgotPasswordHandler();
});

// Preventing default behavior "Forgot password" link
$("#forgotPasswordLink").on("click", () => {
  preventDefault();
})
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
  if (registerValidityCheck()) {
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/auth/register",
      data: { givenName, familyName, email, password },
      beforeSend: () => {
        $(
          "#registerGivenNameInput, #registerFamilyNameInput, #registerEmailInput, #registerPasswordInput, #registerPasswordRepeatInput, button"
        ).prop("disabled", true);
      },
      success: (data) => {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        console.log(data);
        if (data.isSuccessful) {
          $("#registerStatusText").addClass("success");
          $("#registerStatusText").removeClass("error");
        } else {
          $("#registerStatusText").addClass("error");
          $("#registerStatusText").removeClass("success");
        }
        $("#registerStatusText").text(data.message);
      },
      complete: () => {
        $(
          "#registerGivenNameInput, #registerFamilyNameInput, #registerEmailInput, #registerPasswordInput, #registerPasswordRepeatInput, button"
        ).prop("disabled", false);
      },
    });
  }
};

// Forgot password handler function
const onClickForgotPasswordHandler = () => {
  if (forgotPasswordValidityCheck()) {
    const email = forgotPasswordEmailInput.value.trim();
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/auth/forgot",
      data: { email: email },
      beforeSend: () => {
        $("#forgotPasswordEmailInput, button").prop("disabled", true);
      },
      success: (data) => {
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        if (data.isSuccessful) {
          $("#forgotPasswordStatusText").addClass("success");
          $("#forgotPasswordStatusText").removeClass("error");
        } else {
          $("#forgotPasswordStatusText").addClass("error");
          $("#forgotPasswordStatusText").removeClass("success");
        }
        $("#forgotPasswordStatusText").text(data.message);
      },
      complete: () => {
        $("#forgotPasswordEmailInput, button").prop("disabled", false);
      },
    });
  }
};
/* ---------- END OF ACTION HANDLERS FUNCTIONS ---------- */