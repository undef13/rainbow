import {
  setStatus,
  isValidEmail,
  isValidName,
  isValidPassword,
} from "../common/helper-functions.js";
import {
  checkGivenName,
  checkFamilyName,
  checkEmail,
  checkPassword,
  checkPasswordRepeat,
} from "../common/validity-check-functions.js";

/* ---------- GETTING DATA ---------- */
const registerForm = document.getElementById("registerForm");
const registerGivenNameInput = document.getElementById(
  `registerGivenNameInput`
);
const registerFamilyNameInput = document.getElementById(
  `registerFamilyNameInput`
);
const registerEmailInput = document.getElementById(`registerEmailInput`);
const registerPasswordInput = document.getElementById(`registerPasswordInput`);
const registerPasswordRepeatInput = document.getElementById(
  `registerPasswordRepeatInput`
);

const loginForm = document.getElementById(`loginForm`);
const loginEmailInput = document.getElementById(`loginEmailInput`);
const loginPasswordInput = document.getElementById(`loginPasswordInput`);

const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const forgotPasswordEmailInput = document.getElementById(
  "forgotPasswordEmailInput"
);
/* ---------- END OF GETTING DATA ---------- */

/* ---------- DATA VALIDATION ---------- */
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

  if (loginEmailInputValue === "") {
    setStatus(loginEmailInput, true, "Email can not be blank.");
  } else if (!isValidEmail(loginEmailInputValue)) {
    setStatus(loginEmailInput, true, "Not a valid email.");
  } else {
    setStatus(loginEmailInput, false);
  }

  if (loginPasswordInputValue === "") {
    setStatus(loginPasswordInput, true, "Password can not be blank.");
  } else if (loginPasswordInputValue.length < 6) {
    setStatus(
      loginPasswordInput,
      true,
      "Password cannot be less than 6 characters."
    );
  } else {
    setStatus(loginPasswordInput, false);
    return true;
  }
};

// Forgot Password Validation
const forgotPasswordValidityCheck = () => {
  const forgotPasswordEmailInputValue = forgotPasswordEmailInput.value.trim();
  if (forgotPasswordEmailInputValue === "") {
    setStatus(forgotPasswordEmailInput, true, "Email can not be blank.");
  } else if (!isValidEmail(forgotPasswordEmailInputValue)) {
    setStatus(forgotPasswordEmailInput, true, "Not a valid email.");
  } else {
    setStatus(forgotPasswordEmailInput, false);
    return true;
  }
};
/* ---------- END OF DATA VALIDATION ---------- */

/* ---------- ACTION HANDLERS ---------- */
// SIGN UP HANDLER
$("#signUpButton").on("click", () => {
  onClickSignUpHandler();
});

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

// FORGOT PASSWORD HANDLER
$("#forgotPasswordButton").on("click", () => {
  onClickForgotPasswordHandler();
});

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

loginForm.addEventListener("submit", (e) => {
  if (!loginValidityCheck()) {
    e.preventDefault();
  }
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

forgotPasswordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  onClickForgotPasswordHandler();
});

document
  .getElementById("forgotPasswordLink")
  .addEventListener("click", function (event) {
    event.preventDefault();
  });
/* ---------- END OF ACTION HANDLERS ---------- */
