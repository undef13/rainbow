/* Status Function */
export const setStatus = (input, error, message = "Looks good.") => {
  const formGroup = input.parentElement;
  const small = formGroup.querySelector("small");
  error
    ? (formGroup.className = "form-group error")
    : (formGroup.className = "form-group success");
  small.innerText = message;
};

/* Email validation */
export const isValidEmail = (email) => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};

/* Name validation */
export const isValidName = (name) => {
  return /^[a-zA-Zа-яёА-ЯЁ]+$/.test(name);
};

/* Password validation */
export const isValidPassword = (password) => {
  return /^[a-zA-Z0-9]+$/.test(password);
};

/* Alert function */
export const alert = (isSuccessful, message) => {
  $("body").append(
    `<div style="margin:0;" class='alert alert-${
      isSuccessful ? "success" : "danger"
    } fixed-bottom alert-container text-center' role='alert'><span>${message}</span></div>`
  );
  $(".alert-container")
    .delay(4000)
    .fadeOut("slow", () => {
      $(this).remove();
    });
};