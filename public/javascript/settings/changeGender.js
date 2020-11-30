import { alert } from "../common/helper-functions.js";

const gender = document.getElementById("inputGender");
const button = document.getElementById("formGenderButton");

let initialGender = gender.value;

$("#formGenderButton").on("click", (e) => {
  $.ajax({
    type: "POST",
    url: "http://localhost:3000/settings/gender",
    data: {
      gender: gender.value,
    },
    beforeSend: () => {
      $("#inputGender, #formGenderButton").prop("disabled", true);
      $(".spinner").prop("hidden", false);
      $(".status-text").prop("hidden", true);
    },
    success: (data) => {
      $("#genderContainer").text(data.data.gender);
      initialGender = data.data.gender;
      alert(data.isSuccessful, data.message);
    },
    complete: () => {
      $("#inputGender, #formGenderButton").prop("disabled", false);
      $(".spinner").prop("hidden", true);
      $(".status-text").prop("hidden", false);
      checkGenderForChanges();
      $("#genderForm").modal("hide");
    },
  });
});

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

$("#gender-wrapper").on("click", () => {
    checkGenderForChanges();
});

$("#inputGender").on("change", () => {
    checkGenderForChanges();
});