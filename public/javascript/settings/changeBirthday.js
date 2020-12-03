import { alert } from "../common/helper-functions.js";

/* ----------- GETTING DATA ----------- */
const month = document.getElementById("inputMonth");
const year = document.getElementById("inputYear");
const day = document.getElementById("inputDay");
const button = document.getElementById("formBirthdayButton");
/* ----------- END OF GETTING DATA ----------- */

/* ----------- SETTING INITIAL VALUES ----------- */
let initialMonth = month.selectedIndex;
let initialYear = year.value;
let initialDay = day.value;
/* ----------- END OF SETTING INITIAL VALUES ----------- */

/* ----------- CONSTANT VALUES ----------- */
const currentYear = new Date().getFullYear();
const minimalYear = currentYear - 100;
/* ----------- END OF CONSTANT VALUES ----------- */

/* ----------- ACTION HANDLERS ----------- */
$("#formBirthdayButton").on("click", () => {
  onSubmitButtonClick();
});

$("#birthday-wrapper").on("click", () => {
  checkBirthdayForChanges();
});

$("#inputMonth").on("change", () => {
  checkBirthdayForChanges();
});
/* ----------- END OF ACTION HANDLERS ----------- */

/* ----------- ACTION HANDLERS FUNCTIONS ----------- */
const onSubmitButtonClick = () => {
  if (dataValidation()) {
    makeAjax();
  } else {
    $("#dateStatusText").text("Invalid date");
  }
}

const makeAjax = () => {
  $.ajax({
    type: "POST",
    url: "/settings/birthday",
    data: {
      month: month.value,
      year: year.value.trim(),
      day: day.value.trim(),
    },
    beforeSend: ajaxBeforeSend,
    success: (data) => {
      $("#birthdayContainer").text(
        dateToText(data.data.month, data.data.year, data.data.day)
      );
      initialYear = data.data.year;
      initialDay = data.data.day;
      initialMonth = data.data.month + 1;
      alert(data.isSuccessful, data.message);
    },
    complete: ajaxComplete,
  });
}

const ajaxBeforeSend = () => {
  $("#inputMonth, #inputYear, #inputDay, #formBirthdayButton, #closeFormBirthday").prop(
    "disabled",
    true
  );
  $(".spinner").prop("hidden", false);
  $(".status-text").prop("hidden", true);
}

const ajaxComplete = () => {
  $("#inputMonth, #inputYear, #inputDay, #formBirthdayButton, #closeFormBirthday").prop(
    "disabled",
    false
  );
  $(".spinner").prop("hidden", true);
  $(".status-text").prop("hidden", false);
  checkBirthdayForChanges();
  $("#birthdayModal").modal("hide");
  $("#dateStatusText").text("");
  $("#birthdayModal input").removeClass("success");
}

const checkBirthdayForChanges = () => {
  if(month.selectedIndex == 0) {
    return button.disabled = true;
  }
  if(year.value == initialYear && day.value == initialDay && month.selectedIndex == initialMonth) {
    button.disabled = true;
  } else {
    button.disabled = false;
  }
}

const dateToText = (month, year, day) => {
  switch (month) {
    case 0:
      return `January ${day}, ${year}`;
    case 1:
      return `February ${day}, ${year}`;
    case 2:
      return `March ${day}, ${year}`;
    case 3:
      return `April ${day}, ${year}`;
    case 4:
      return `May ${day}, ${year}`;
    case 5:
      return `June ${day}, ${year}`;
    case 6:
      return `July ${day}, ${year}`;
    case 7:
      return `August ${day}, ${year}`;
    case 8:
      return `September ${day}, ${year}`;
    case 9:
      return `October ${day}, ${year}`;
    case 10:
      return `November ${day}, ${year}`;
    case 11:
      return `December ${day}, ${year}`;
  }
};

const dataValidation = () => {
  let userYear = year.value;
  let userMonth = month.value;
  let userDay = day.value;

  if (
    checkYearValidity(userYear) & 
    checkDayValidity(userDay, userMonth, userYear) &
    checkDateValidity(userYear, userMonth, userDay)
  ) {
    return true;
  } else {
    return false;
  }
};

const checkDateValidity = (userYear, userMonth, userDay) => {
  const userDate = new Date(`${userYear}, ${userMonth}, ${userDay}`);
  if(userDate > new Date()) {
    return false;
  } else {
    return true;
  }
}

const checkYearValidity = (userYear) => {
  if (userYear == "") {
    setErrorStatus(true, year);
    return false;
  } else if (userYear > currentYear) {
    setErrorStatus(true, year);
    return false;
  } else if (userYear < minimalYear) {
    setErrorStatus(true, year);
    return false;
  } else {
    setErrorStatus(false, year);
    return true;
  }
};

const checkDayValidity = (userDay, userMonth, userYear) => {
  if (userDay == "") {
    setErrorStatus(true, day)
    return false;
  }

  switch (userMonth) {
    case "January":
    case "March":
    case "May":
    case "July":
    case "August":
    case "October":
    case "December": {
      if (userDay < 1 || userDay > 31) {
        setErrorStatus(true, day)
        return false;
      } else {
        return true;
      }
    }
    case "April":
    case "June":
    case "September":
    case "November": {
      if (userDay < 1 || userDay > 30) {
        setErrorStatus(true, day)
        return false;
      } else {
        setErrorStatus(false, day)
        return true;
      }
    }
    case "February": {
      let leapYear = 1920;
      for (leapYear; leapYear <= userYear; leapYear += 4) {
        if (leapYear == userYear) {
          if (userDay < 1 || userDay > 29) {
            setErrorStatus(true, day)
            return false;
          } else {
            setErrorStatus(false, day)
            return true;
          }
        }
      }
      if (userDay < 1 || userDay > 28) {
        setErrorStatus(true, day)
        return false;
      }
      setErrorStatus(false, day)
      return true;
    }
    default: {
      return false;
    }
  }
};

const setErrorStatus = (error, input) => {
  if (error) {
    input.className = "form-control error";
  } else {
    input.className = "form-control success";
  }
}

// Only numbers in input fields
$("#inputYear, #inputDay").on("input", function() {
  $(this).val(
    $(this)
      .val()
      .replace(/^0|[^\d]/g, "")
  );
  checkBirthdayForChanges();
});
/* ----------- END OF ACTION HANDLERS FUNCTIONS ----------- */