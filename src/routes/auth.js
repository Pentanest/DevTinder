const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    validateSignUpData(req.body);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    }); // creating a new instance of the user model

    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error adding user: " + err?.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials!");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
      res.send("Login successful");
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (err) {
    res.status(400).send("Error adding user: " + err?.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logged out successfully!");
});

module.exports = authRouter;
