/* Prevent Default Link Behaviour */
document
  .getElementById("forgotPasswordLink")
  .addEventListener("click", function (event) {
    event.preventDefault();
  });

/* Settings for small screens */
$(document).ready(() => {
  let windowWidth = $(window).width();
  if (windowWidth > 991) {
    $("#containerRow").addClass("align-items-center h-100");
    $("#containerRow").removeClass("text-center");
  } else {
    $("#containerRow").removeClass("align-items-center h-100");
    $("#containerRow").addClass("text-center");
  }

  $(window).resize(() => {
    let windowWidth = $(window).width();
    if (windowWidth > 991) {
      $("#containerRow").addClass("align-items-center h-100");
      $("#containerRow").removeClass("text-center");
    } else {
      $("#containerRow").removeClass("align-items-center h-100");
      $("#containerRow").addClass("text-center");
    }
  });
});

/* -------------- DATA VALIDATION -------------- */

// -------------- Register Form Validation --------------
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

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(`hello`);
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

const registerValidityCheck = () => {
  const registerGivenNameInputValue = registerGivenNameInput.value.trim();
  const registerFamilyNameInputValue = registerFamilyNameInput.value.trim();
  const registerEmailInputValue = registerEmailInput.value.trim();
  const registerPasswordInputValue = registerPasswordInput.value.trim();
  const registerPasswordRepeatInputValue = registerPasswordRepeatInput.value.trim();

  // First Name validation
  if (registerGivenNameInputValue === "") {
    setStatus(registerGivenNameInput, true, "First name can not be blank.");
  } else if (!isValidName(registerGivenNameInputValue)) {
    setStatus(
      registerGivenNameInput,
      true,
      "First name should contain only letters."
    );
  } else {
    setStatus(registerGivenNameInput, false);
  }

  // Last Name validation
  if (registerFamilyNameInputValue === "") {
    setStatus(registerFamilyNameInput, true, "Last name can not be blank.");
  } else if (!isValidName(registerFamilyNameInputValue)) {
    setStatus(
      registerFamilyNameInput,
      true,
      "Last name should contain only letters."
    );
  } else {
    setStatus(registerFamilyNameInput, false);
  }

  // Email validation
  if (registerEmailInputValue === "") {
    setStatus(registerEmailInput, true, "Email can not be blank.");
  } else if (!isValidEmail(registerEmailInputValue)) {
    setStatus(registerEmailInput, true, "Not a valid email.");
  } else {
    setStatus(registerEmailInput, false);
  }

  // Password validation
  if (registerPasswordInputValue === "") {
    setStatus(registerPasswordInput, true, "Password can not be blank.");
  } else if (registerPasswordInputValue.length < 6) {
    setStatus(
      registerPasswordInput,
      true,
      "Password cannot be less than 6 characters."
    );
  } else if (!isValidPassword(registerPasswordInputValue)) {
    setStatus(
      registerPasswordInput,
      true,
      "Password should not contain special symbols."
    );
  } else {
    setStatus(registerPasswordInput, false);
  }

  // Repeat password validation
  if (
    registerPasswordInputValue === "" &&
    registerPasswordRepeatInputValue === ""
  ) {
    setStatus(
      registerPasswordRepeatInput,
      true,
      "Enter your password and then repeat it here."
    );
  } else if (registerPasswordRepeatInputValue !== registerPasswordInputValue) {
    setStatus(registerPasswordRepeatInput, true, "Passwords do not match.");
  } else {
    setStatus(registerPasswordRepeatInput, false);
    return true;
  }
};
// -------------- End of Register Form Validation --------------

// -------------- Login Form validation --------------
const loginForm = document.getElementById(`loginForm`);
const loginEmailInput = document.getElementById(`loginEmailInput`);
const loginPasswordInput = document.getElementById(`loginPasswordInput`);

loginForm.addEventListener("submit", (e) => {
  if (!loginValidityCheck()) {
    e.preventDefault();
  }
});

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
// -------------- End of Login Form validation --------------

// -------------- Forgot Password Form validation --------------
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const forgotPasswordEmailInput = document.getElementById(
  "forgotPasswordEmailInput"
);

forgotPasswordForm.addEventListener("submit", (e) => {
  e.preventDefault();
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

// -------------- End of Forgot Password Form validation --------------

// -------------- Helper Functions --------------
const setStatus = (input, error, message = "Looks good.") => {
  const formGroup = input.parentElement;
  const small = formGroup.querySelector("small");
  error
    ? (formGroup.className = "form-group error")
    : (formGroup.className = "form-group success");
  small.innerText = message;
};

isValidEmail = (email) => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};

isValidName = (name) => {
  return /^[a-zA-Zа-яёА-ЯЁ]+$/.test(name);
};

isValidPassword = (password) => {
  return /^[a-zA-Z0-9]+$/.test(password);
};
// -------------- End of Helper Functions --------------
