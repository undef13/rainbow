/* ---------- GETTING DATA ---------- */
const resetPasswordForm = document.getElementById("resetPasswordForm");
const resetPasswordNewPassword = document.getElementById(
  "resetPasswordNewPassword"
);
const resetPasswordNewPasswordRepeat = document.getElementById(
  "resetPasswordNewPasswordRepeat"
);
/* ---------- END OF GETTING DATA ---------- */

/* ---------- DATA VALIDATIOn ---------- */
const resetPasswordValidityCheck = () => {
  const resetPasswordNewPasswordValue = resetPasswordNewPassword.value.trim();
  const resetPasswordNewPasswordRepeatValue = resetPasswordNewPasswordRepeat.value.trim();

  if (resetPasswordNewPasswordValue === "") {
    setStatus(resetPasswordNewPassword, true, "New password can not be blank");
  } else if (resetPasswordNewPasswordValue.length < 6) {
    setStatus(
      resetPasswordNewPassword,
      true,
      "Password can not be less then 6 symbols"
    );
  } else if (!isValidPassword(resetPasswordNewPasswordValue)) {
    setStatus(
      resetPasswordNewPassword,
      true,
      "Password should not contain special symbols"
    );
  } else {
    setStatus(resetPasswordNewPassword, false);
  }

  if (
    resetPasswordNewPasswordRepeatValue === "" &&
    resetPasswordNewPasswordValue === ""
  ) {
    setStatus(
      resetPasswordNewPasswordRepeat,
      true,
      "Enter your password and then repeat it here"
    );
  } else if (
    resetPasswordNewPasswordRepeatValue !== resetPasswordNewPasswordValue
  ) {
    setStatus(resetPasswordNewPasswordRepeat, true, "Passwords do not match");
  } else if (resetPasswordNewPasswordRepeatValue.length < 6) {
    setStatus(
      resetPasswordNewPasswordRepeat,
      true,
      "Password can not be less then 6 symbols"
    );
  } else {
    setStatus(resetPasswordNewPasswordRepeat, false);
    return true;
  }
};

resetPasswordForm.addEventListener("submit", (e) => {
  if (!resetPasswordValidityCheck()) {
    e.preventDefault();
  }
});
/* ---------- END OF DATA VALIDATION ---------- */

/* -------------- HELPER FUNCTIONS -------------- */
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
/* -------------- END OF HELPER FUNCTIONS -------------- */
