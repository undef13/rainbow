import { setStatus, isValidPassword } from "./helper-functions.js";

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
