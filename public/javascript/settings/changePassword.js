import {
  checkPassword,
  checkPasswordRepeat,
} from "../common/validity-check-functions.js";
import { alert } from "../common/helper-functions.js";

/* ----------- GETTING DATA ----------- */
const currentPassword = document.getElementById("currentPasswordInput");
const newPassword = document.getElementById("newPasswordInput");
const repeatNewPassword = document.getElementById("repeatNewPasswordInput");
/* ----------- END OF GETTING DATA ----------- */

/* ----------- ACTION HANDLERS ----------- */
// Submit button click
$("#formChangePasswordButton").on("click", () => {
  onSubmitButtonClick();
});

/* ----------- END OF ACTION HANDLERS ----------- */

/* ----------- ACTION HANDLERS FUNCTIONS ----------- */

const onSubmitButtonClick = () => {
  if (dataValidation()) {
    makeAjax();
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

const makeAjax = () => {
  $.ajax({
    type: "POST",
    url: "/settings/change-password",
    data: {
      currentPassword: currentPassword.value.trim(),
      newPassword: newPassword.value.trim(),
    },
    beforeSend: ajaxBeforeSend,
    success: (data) => {
      if (data.data) {
        $("#changePasswordContainer").text(
          `Last changed ${data.data.lastChangePassword}`
        );
      }
      alert(data.isSuccessful, data.message);
    },
    complete: ajaxComplete,
  });
}

const ajaxBeforeSend = () => {
  $(
    "#currentPasswordInput, #newPasswordInput, #repeatNewPasswordInput, #closeFormChangePassword, #formChangePasswordButton"
  ).prop("disabled", true);
  $(".spinner").prop("hidden", false);
  $(".status-text").prop("hidden", true);
}

const ajaxComplete = () => {
  $(
    "#currentPasswordInput, #newPasswordInput, #repeatNewPasswordInput, #closeFormChangePassword, #formChangePasswordButton"
  ).prop("disabled", false);
  $(".spinner").prop("hidden", true);
  $(".status-text").prop("hidden", false);
  $("#changePasswordModal").modal("hide");
  $("#changePasswordModal .form-group").removeClass("success");
  $("#changePasswordModal .form-group input[type='password']").val('')
}
/* ----------- END OF ACTION HANDLERS FUNCTIONS ----------- */