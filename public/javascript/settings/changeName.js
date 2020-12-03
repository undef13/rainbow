import {
  checkGivenName,
  checkFamilyName,
} from "../common/validity-check-functions.js";
import { alert } from "../common/helper-functions.js";

/* ----------- GETTING DATA ----------- */
const givenNameInput = document.getElementById("givenNameInput");
const familyNameInput = document.getElementById("familyNameInput");
const formNameButton = document.getElementById("formNameButton");
/* ----------- END OF GETTING DATA ----------- */

/* ----------- SETTING INITIAL VALUES ----------- */
let initialGivenName = givenNameInput.value.trim();
let initialFamilyName = familyNameInput.value.trim();
/* ----------- END OF SETTING INITIAL VALUES ----------- */

/* ----------- CHECK INPUTS FOR CHANGES ----------- */
const checkInputsForChanges = () => {
  if (
    givenNameInput.value.trim() == initialGivenName &&
    familyNameInput.value.trim() == initialFamilyName
  ) {
    formNameButton.disabled = true;
  } else {
    formNameButton.disabled = false;
  }
};
/* ----------- END OF CHECK INPUTS FOR CHANGES ----------- */

/* ----------- ACTION HANDLERS ----------- */
// Click on div to block button
$("#name-wrapper").on("click", () => {
  checkInputsForChanges();
});

// Click on "Save" button in the name form
$("#formNameButton").on("click", () => {
  onSubmitButtonClick();
});

/* ----------- END OF ACTION HANDLERS ----------- */

/* ----------- ACTION HANDLERS FUNCTIONS ----------- */
const onSubmitButtonClick = () => {
  if (formNameValidation()) {
    makeAjax();
  }
};

const makeAjax = () => {
  $.ajax({
    type: "POST",
    url: "/settings/display-name",
    data: {
      givenName: givenNameInput.value.trim(),
      familyName: familyNameInput.value.trim(),
    },
    beforeSend: ajaxBeforeSend,
    success: (data) => {
      $("#displayNameContainer").text(data.data.displayName);
      $("#displayNameSpan").text(data.data.displayName);

      initialGivenName = data.data.givenName;
      initialFamilyName = data.data.familyName;
      checkInputsForChanges();
      alert(data.isSuccessful, data.message);
    },
    complete: ajaxComplete,
  });
};

const ajaxBeforeSend = () => {
  $("#givenNameInput, #familyNameInput, #closeFormName").prop("disabled", true);
  $(".spinner").prop("hidden", false);
  $(".status-text").prop("hidden", true);
};

const ajaxComplete = () => {
  $("#givenNameInput, #familyNameInput, #closeFormName").prop(
    "disabled",
    false
  );
  $(".spinner").prop("hidden", true);
  $(".status-text").prop("hidden", false);
  $("#displayNameModal").modal("hide");
  $("#displayNameModal .form-group").removeClass("success");
};
/* ----------- END OF ACTION HANDLERS FUNCTIONS ----------- */

/* ----------- FUNCTIONS FOR VALIDATION FORMS ----------- */
// Name Form
const formNameValidation = () => {
  const givenName = givenNameInput.value.trim();
  const familyName = familyNameInput.value.trim();
  if (
    checkGivenName(givenName, givenNameInput) &
    checkFamilyName(familyName, familyNameInput)
  ) {
    return true;
  } else {
    return false;
  }
};
/* ----------- END OF FUNCTIONS FOR VALIDATION FORMS ----------- */

/* ----------- ADDING EVENT LISTENERS ----------- */
givenNameInput.addEventListener("input", () => checkInputsForChanges());
familyNameInput.addEventListener("input", () => checkInputsForChanges());
/* ----------- END OF ADDING EVENT LISTENERS ----------- */
