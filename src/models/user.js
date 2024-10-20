const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        return ["male", "female", "others"].includes(value);
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Enter a valid photo url");
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about",
    },
    skills: {
      type: [String],
      default: ["JavaScript", "React"],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "Dev@Tinder", { expiresIn: "1h" });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInput) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = bcrypt.compare(passwordInput, passwordHash);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
