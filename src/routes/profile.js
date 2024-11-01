const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  //   const userId = req.user._id;
  //   const data = req.body;

  //   try {
  //     const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "password", "skills"];

  //     const isUpdateAllowed = Object.keys(data).every((item) => ALLOWED_UPDATES.includes(item));
  //     if (!isUpdateAllowed) {
  //       throw new Error("Update not allowed");
  //     }
  //     const user = await User.findByIdAndUpdate(userId, data, { returnDocument: "after", runValidators: true });
  //     console.log(user);
  //     res.send("User updated successfully");
  //   } catch (err) {
  //     res.status(400).send("Error: " + err.message);
  //   }
  try {
    if (validateEditProfileData(req.body)) {
      throw new Error("Update not allowed!");
    }
    const user = req.user;
    const updatedUser = User.findByIdAndUpdate(user._id, req.body, { returnDocument: "after", runValidators: true });
    console.log(updatedUser);
    res.send("Profile updated successfully!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { existingPassword, newPassword } = req.body;
    const isPasswordValid = await user.validatePassword(existingPassword);
    if (isPasswordValid) {
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(user._id, { password: newHashedPassword }, { runValidators: true });
      res.clearCookie();
      res.send("Password updated successfully!");
    } else {
      throw new Error("Wrong existing password");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
