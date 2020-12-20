import { alert, makeAjax } from "../common/helper-functions.js";

/* ----------- GETTING DATA ----------- */
const selectMonth = document.getElementById("inputMonth");
const year = document.getElementById("inputYear");
const day = document.getElementById("inputDay");
const birthdaySaveButton = document.getElementById("birthdaySaveButton");

const birthdayWrapper = document.getElementById("birthday-wrapper");
const birthdayModal = document.getElementById("birthdayModal");
/* ----------- END OF GETTING DATA ----------- */

/* ----------- SETTING INITIAL VALUES ----------- */
let initialMonth = selectMonth.selectedIndex;
let initialYear = year.value;
let initialDay = day.value;
/* ----------- END OF SETTING INITIAL VALUES ----------- */

/* ----------- CONSTANT VALUES ----------- */
const currentYear = new Date().getFullYear();
const minimalYear = currentYear - 100;
/* ----------- END OF CONSTANT VALUES ----------- */

/* ----------- ACTION HANDLERS ----------- */
birthdaySaveButton.addEventListener("click", () => {
	onSubmitButtonClick();
});

birthdayWrapper.addEventListener("click", () => {
  checkBirthdayForChanges();
});

selectMonth.addEventListener("change", () => {
  checkBirthdayForChanges();
});
/* ----------- END OF ACTION HANDLERS ----------- */

/* ----------- ACTION HANDLERS FUNCTIONS ----------- */
const onSubmitButtonClick = () => {
  if (dataValidation()) {
		ajaxAction("BEFORE_SEND");
    makeAjax("/settings/birthday", {
			month: selectMonth.value,
      year: year.value.trim(),
      day: day.value.trim(),
		}).then(data => {
			document.getElementById("birthdayContainer").textContent = dateToText(data.data.month, data.data.year, data.data.day);
      initialYear = data.data.year;
      initialDay = data.data.day;
      initialMonth = data.data.month + 1;
			ajaxAction("AFTER_SEND");
			alert(data.isSuccessful, data.message);
		})
  } else {
    birthdayModal.querySelector("#dateStatusText").textContent = "Invalid date";
  }
}

const ajaxAction = (action) => {
	const elements = birthdayModal.querySelectorAll("input, select, button");
	switch (action) {
		case "BEFORE_SEND":
			for(let element of elements) {
				element.disabled = true;
			}
			birthdayModal.querySelector(".spinner").hidden = false;
			birthdayModal.querySelector(".button-text").hidden = true;
			break;
		case "AFTER_SEND":
			for(let element of elements) {
				element.disabled = false;
			}
			birthdayModal.querySelector(".spinner").hidden = true;
			birthdayModal.querySelector(".button-text").hidden = false;
			checkBirthdayForChanges();
			const modal = bootstrap.Modal.getInstance(birthdayModal);
			modal.hide();
			birthdayModal.querySelector("#dateStatusText").textContent = "";
			const inputs = birthdayModal.querySelectorAll("input");
			for(let input of inputs) {
				input.classList.remove("error");
				input.classList.remove("success");
			}
			break;
	}
}

const checkBirthdayForChanges = () => {
  if(selectMonth.selectedIndex == 0) {
    return birthdaySaveButton.disabled = true;
  }
  if(year.value == initialYear && day.value == initialDay && selectMonth.selectedIndex == initialMonth) {
    birthdaySaveButton.disabled = true;
  } else {
    birthdaySaveButton.disabled = false;
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
  let userMonth = selectMonth.value;
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
    input.classList.add("error");
  } else {
		input.classList.add("success");
  }
}

// Only numbers in input fields
day.addEventListener("input", function() {
	this.value = this.value.replace(/^0|[^\d]/g, "");
	checkBirthdayForChanges();
});

year.addEventListener("input", function() {
	this.value = this.value.replace(/^0|[^\d]/g, "");
	checkBirthdayForChanges();
});
/* ----------- END OF ACTION HANDLERS FUNCTIONS ----------- */