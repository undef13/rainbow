import { setStatus, isValidName } from "./helper-functions.js";

export const checkGivenName = (givenName, givenNameInput) => {
  if (givenName === "") {
    setStatus(givenNameInput, true, "First name can not be blank.");
    return false;
  } else if (!isValidName(givenName)) {
    setStatus(givenNameInput, true, "First name should contain only letters.");
    return false;
  } else {
    setStatus(givenNameInput, false);
    return true;
  }
};

export const checkFamilyName = (familyName, familyNameInput) => {
  if (familyName === "") {
    setStatus(familyNameInput, true, "Last name can not be blank.");
    return false;
  } else if (!isValidName(familyName)) {
    setStatus(familyNameInput, true, "Last name should contain only letters.");
    return false;
  } else {
    setStatus(familyNameInput, false);
    return true;
  }
};

export const checkEmail = (email, emailInput) => {
  if (email === "") {
    setStatus(emailInput, true, "Email can not be blank.");
    return false;
  } else if (!isValidEmail(email)) {
    setStatus(emailInput, true, "Not a valid email.");
    return false;
  } else {
    setStatus(emailInput, false);
    return true;
  }
};

export const checkPassword = (password, passwordInput) => {
  if (password === "") {
    setStatus(passwordInput, true, "Password can not be blank.");
    return false;
  } else if (password.length < 6) {
    setStatus(
      passwordInput,
      true,
      "Password cannot be less than 6 characters."
    );
    return false;
  } else if (!isValidPassword(password)) {
    setStatus(
      passwordInput,
      true,
      "Password should not contain special symbols."
    );
    return false;
  } else {
    setStatus(passwordInput, false);
    return true;
  }
};

export const checkPasswordRepeat = (password, passwordRepeat, passwordRepeatInput) => {
  if (password === "" && passwordRepeat === "") {
    setStatus(passwordRepeatInput, true, "Enter your password and then repeat it here.");
    return false;
  } else if (passwordRepeat !== password) {
    setStatus(passwordRepeatInput, true, "Passwords do not match.");
    return false;
  } else {
    setStatus(passwordRepeatInput, false);
    return true;
  }
};
