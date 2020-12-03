import { alert } from "../common/helper-functions.js";

/* ----------- GETTING DATA ----------- */
const bioTextArea = document.getElementById("bioTextArea");
const bioSaveButton = document.getElementById("formBioButton");
/* ----------- END OF GETTING DATA ----------- */

/* ----------- GETTING DATA ----------- */
let initialBioText = bioTextArea.value.trim();
/* ----------- END OF GETTING DATA ----------- */

/* ----------- CHECK TEXT AREA FOR CHANGES ----------- */
const checkTextAreaForChanges = () => {
  if (bioTextArea.value.trim() == initialBioText) {
    bioSaveButton.disabled = true;
  } else {
    bioSaveButton.disabled = false;
  }
};
/* ----------- END OF CHECK TEXT AREA FOR CHANGES ----------- */

$("#formBioButton").on("click", () => {
  $.ajax({
    type: "POST",
    url: "/settings/bio",
    data: {
      bio: bioTextArea.value.trim(),
    },
    beforeSend: () => {
      $("#bioTextArea, #formBioButton, #closeFormBio").prop("disabled", true);
      $(".spinner").prop("hidden", false);
      $(".status-text").prop("hidden", true);
    },
    success: (data) => {
      $("#bioContainer").text(
        data.data.bio !== ""
          ? data.data.bio.length > 35
            ? `${data.data.bio.slice(0, 35)}...`
            : data.data.bio
          : "None"
      );
      initialBioText = data.data.bio;
      alert(data.isSuccessful, data.message);
    },
    complete: () => {
      $("#bioTextArea, #formBioButton, #closeFormBio").prop("disabled", false);
      $(".spinner").prop("hidden", true);
      $(".status-text").prop("hidden", false);
      checkTextAreaForChanges();
      $("#bioForm").modal("hide");
    },
  });
});

/* ----------- EVENT LISTENERS ----------- */
$("#bio-wrapper").on("click", () => {
  $(".characters-left").text(bioTextArea.maxLength - bioTextArea.value.length);
  checkTextAreaForChanges();
});

$("#bioTextArea").on("input", () => {
  $(".characters-left").text(bioTextArea.maxLength - bioTextArea.value.length);
  checkTextAreaForChanges();
});
/* ----------- END OF EVENT LISTENERS ----------- */
