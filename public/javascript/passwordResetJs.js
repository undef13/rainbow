const resetPasswordForm = document.getElementById("resetPasswordForm");
const resetPasswordNewPassword = document.getElementById(
  "resetPasswordNewPassword"
);
const resetPasswordNewPasswordRepeat = document.getElementById(
  "resetPasswordNewPasswordRepeat"
);

resetPasswordForm.addEventListener("submit", (e) => {
  if (!resetPasswordValidityCheck()) {
    e.preventDefault();
  }
});

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
  } else {
    setStatus(resetPasswordNewPasswordRepeat, false);
    return true;
  }
};

const setStatus = (input, error, message = "Looks good") => {
  const formGroup = input.parentElement;
  const small = formGroup.querySelector("small");
  error
    ? (formGroup.className = "form-group error")
    : (formGroup.className = "form-group success");
  small.innerText = message;
};

isValidPassword = (password) => {
  return /^[a-zA-Z0-9]+$/.test(password);
};
