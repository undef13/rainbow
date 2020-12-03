import { alert } from "../common/helper-functions.js";

/* ----------- GETTING DATA ----------- */
const gender = document.getElementById("inputGender");
const button = document.getElementById("formGenderButton");
/* ----------- END OF GETTING DATA ----------- */

/* ----------- SETTING INITIAL VALUES ----------- */
let initialGender = gender.value;
/* ----------- END OF SETTING INITIAL VALUES ----------- */

/* ----------- ACTION HANDLERS ----------- */
$("#formGenderButton").on("click", (e) => {
  makeAjax();
});

$("#gender-wrapper").on("click", () => {
  checkGenderForChanges();
});

$("#inputGender").on("change", () => {
  checkGenderForChanges();
});
/* ----------- END OF ACTION HANDLERS ----------- */

/* ----------- ACTION HANDLERS FUNCTIONS ----------- */
const makeAjax = () => {
  $.ajax({
    type: "POST",
    url: "/settings/gender",
    data: {
      gender: gender.value,
    },
    beforeSend: ajaxBeforeSend,
    success: (data) => {
      $("#genderContainer").text(data.data.gender);
      initialGender = data.data.gender;
      alert(data.isSuccessful, data.message);
    },
    complete: ajaxComplete,
  });
}

const ajaxBeforeSend = () => {
  $("#inputGender, #formGenderButton, #closeFormGender").prop("disabled", true);
  $(".spinner").prop("hidden", false);
  $(".status-text").prop("hidden", true);
}

const ajaxComplete = () => {
  $("#inputGender, #formGenderButton, #closeFormGender").prop("disabled", false);
  $(".spinner").prop("hidden", true);
  $(".status-text").prop("hidden", false);
  checkGenderForChanges();
  $("#genderModal").modal("hide");
}

const checkGenderForChanges = () => {
    if (gender.selectedIndex == 0) {
        return button.disabled = true;
    }
    if(initialGender == gender.value) {
        button.disabled = true;
    } else {
        button.disabled = false
    }
}

/* ----------- END OF ACTION HANDLERS FUNCTIONS ----------- */