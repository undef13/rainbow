/* Status Function */
export const setStatus = (input, error, message = "Looks good.") => {
  const formGroup = input.parentElement;
  const small = formGroup.querySelector("small");
  if (error) {
    formGroup.classList.add("error");
    formGroup.classList.remove("success");
  } else {
    formGroup.classList.add("success");
    formGroup.classList.remove("error");
  }
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
  let alert = document.createElement("div");
  alert.innerHTML = `<div style="margin:0;" class='alert alert-${
    isSuccessful ? "success" : "danger"
  } fixed-bottom alert-container text-center' role='alert'><span>${message}</span></div>`;
  document.body.appendChild(alert);

  setTimeout(() => {
    const fadeTarget = document.querySelector(".alert");
    const fadeEffect = setInterval(() => {
      if (!fadeTarget.style.opacity) {
        fadeTarget.style.opacity = 1;
      }
      if (fadeTarget.style.opacity > 0) {
        fadeTarget.style.opacity -= 0.1;
      } else {
        fadeTarget.remove();
        clearInterval(fadeEffect);
      }
    }, 50);
  }, 4000);
};

/* Ajax */
export const makeAjax = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};
