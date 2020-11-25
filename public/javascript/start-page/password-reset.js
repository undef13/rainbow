import { checkPassword, checkPasswordRepeat } from "../common/validity-check-functions.js";

/* ---------- GETTING DATA ---------- */
const resetPasswordForm = document.getElementById("resetPasswordForm");
const resetPasswordNewPassword = document.getElementById("resetPasswordNewPassword");
const resetPasswordNewPasswordRepeat = document.getElementById("resetPasswordNewPasswordRepeat");
/* ---------- END OF GETTING DATA ---------- */

/* ---------- DATA VALIDATION FUNCTIONS ---------- */
// Reset Password form
const resetPasswordValidityCheck = () => {
  const resetPasswordNewPasswordValue = resetPasswordNewPassword.value.trim();
  const resetPasswordNewPasswordRepeatValue = resetPasswordNewPasswordRepeat.value.trim();

  if(checkPassword(resetPasswordNewPasswordValue, resetPasswordNewPassword) &
     checkPasswordRepeat(resetPasswordNewPasswordValue, resetPasswordNewPasswordRepeatValue, resetPasswordNewPasswordRepeat)
  ) {
    return true;
  } else {
    return false;
  }
};
/* ---------- END OF DATA VALIDATION FUNCTIONS ---------- */

/* ---------- ACTION HANDLERS ---------- */
resetPasswordForm.addEventListener("submit", (e) => {
  if (!resetPasswordValidityCheck()) {
    e.preventDefault();
  }
});
/* ---------- END OF ACTION HANDLERS ---------- */