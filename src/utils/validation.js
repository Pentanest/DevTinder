const validator = require("validator");

const validateSignUpData = (body) => {
  const { firstName, lastName, emailId, password } = body;
  if (!firstName || !lastName) {
    throw new Error("Please provide proper names");
  }
  if (firstName.length < 2) {
    throw new Error("Please provide proper names");
  }
  if (lastName.length < 2) {
    throw new Error("Please provide proper names");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateEditProfileData = (body) => {
  const ALLOWED_EDIT_FIELDS = ["firstName", "lastName", "photoUrl", "gender", "age", "about", "skills"];

  const isEditAllowed = Object.keys(body).every((item) => ALLOWED_EDIT_FIELDS.includes(item));
  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
