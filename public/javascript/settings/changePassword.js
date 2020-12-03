import {
  checkPassword,
  checkPasswordRepeat,
} from "../common/validity-check-functions.js";
import { alert } from "../common/helper-functions.js";

/* GETTING DATA */
const currentPassword = document.getElementById("currentPasswordInput");
const newPassword = document.getElementById("newPasswordInput");
const repeatNewPassword = document.getElementById("repeatNewPasswordInput");
/* END OF GETTING DATA */

$("#formChangePasswordButton").on("click", () => {
  if (dataValidation()) {
    $.ajax({
      type: "POST",
      url: "/settings/change-password",
      data: {
        currentPassword: currentPassword.value.trim(),
        newPassword: newPassword.value.trim(),
      },
      beforeSend: () => {
        $(
          "#currentPasswordInput, #newPasswordInput, #repeatNewPasswordInput, #closeFormChangePassword, #formChangePasswordButton"
        ).prop("disabled", true);
        $(".spinner").prop("hidden", false);
        $(".status-text").prop("hidden", true);
      },
      success: (data) => {
        if (data.data) {
          $("#changePasswordContainer").text(
            `Last changed ${data.data.lastChangePassword}`
          );
        }
        alert(data.isSuccessful, data.message);
      },
      complete: () => {
        $(
          "#currentPasswordInput, #newPasswordInput, #repeatNewPasswordInput, #closeFormChangePassword, #formChangePasswordButton"
        ).prop("disabled", false);
        $(".spinner").prop("hidden", true);
        $(".status-text").prop("hidden", false);
        $("#changePasswordForm").modal("hide");
      },
    });
  }
});

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
