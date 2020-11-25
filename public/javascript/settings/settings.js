import { checkGivenName, checkFamilyName } from "../common/validity-check-functions.js";
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
const checkInputsForChanges = (action) => {
  switch (action) {
    case "formName": {
      if (
        givenNameInput.value.trim() == initialGivenName &&
        familyNameInput.value.trim() == initialFamilyName
      ) {
        formNameButton.disabled = true;
        console.log(initialGivenName, initialFamilyName);
      } else {
        formNameButton.disabled = false;
      }
      break;
    }
  }
};
/* ----------- END OF CHECK INPUTS FOR CHANGES ----------- */

/* ----------- ACTION HANDLERS ----------- */
// Click on div to block button
$('#name-wrapper').on('click', () => {
    checkInputsForChanges("formName");
});

// Click on "Save" button in the name form
$("#formNameButton").on("click", () => {
  if (formNameValidation()) {
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/settings/display-name",
      data: {
        givenName: givenNameInput.value.trim(),
        familyName: familyNameInput.value.trim(),
      },
      beforeSend: () => {
        $("#givenNameInput, #familyNameInput, #closeFormName").prop(
          "disabled",
          true
        );
        $(".spinner").prop("hidden", false);
        $(".status-text").prop("hidden", true);
      },
      success: (data) => {
        console.log(data);
        $("#displayNameContainer").text(data.data.displayName);
        $("#displayNameSpan").text(data.data.displayName);

        initialGivenName = data.data.givenName;
        initialFamilyName = data.data.familyName;
        checkInputsForChanges("formName");
        alert(data.isSuccessful, data.message);
      },
      complete: () => {
        $("#givenNameInput, #familyNameInput, #closeFormName").prop(
          "disabled",
          false
        );
        $(".spinner").prop("hidden", true);
        $(".status-text").prop("hidden", false);
        $("#displayNameForm").modal("hide");
      },
    });
  }
});


/* ----------- END OF ACTION HANDLERS ----------- */

/* ----------- FUNCTIONS FOR VALIDATION FORMS ----------- */
// Name Form
const formNameValidation = () => {
  const givenName = givenNameInput.value.trim();
  const familyName = familyNameInput.value.trim();
  if(checkGivenName(givenName, givenNameInput) & checkFamilyName(familyName, familyNameInput)) {
    return true;
  } else {
    return false;
  }
};
/* ----------- END OF FUNCTIONS FOR VALIDATION FORMS ----------- */


/* ----------- ADDING EVENT LISTENERS ----------- */
givenNameInput.addEventListener("input", () =>
  checkInputsForChanges("formName")
);
familyNameInput.addEventListener("input", () =>
  checkInputsForChanges("formName")
);
/* ----------- END OF ADDING EVENT LISTENERS ----------- */
