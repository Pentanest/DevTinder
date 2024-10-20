const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

const PORT = 7777;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

// Get user by emailId
app.get("/user", async (req, res) => {
  const { emailId } = req.body;
  try {
    const user = await User.findOne({ emailId });
    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching user: " + err.message);
  }
});

// Get all the users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length) {
      res.send(users);
    } else {
      res.status(404).send("No users found");
    }
  } catch (err) {
    res.status(400).send("Error fetching users: " + err.message);
  }
});

// Delete user by _id
app.delete("/user", async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Error deleting user: " + err.message);
  }
});

// Update user by _id
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "password", "skills"];

    const isUpdateAllowed = Object.keys(data).every((item) => ALLOWED_UPDATES.includes(item));
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate(userId, data, { returnDocument: "after", runValidators: true });
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Update user by emailId
// app.patch("/user", async (req, res) => {
//   const { emailId } = req.body;
//   const data = req.body;
//   try {
//     const user = await User.findOneAndUpdate({ emailId }, data, { returnDocument: "after" });
//     console.log(user);
//     res.send("User updated successfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent the connection request!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(PORT, () => {
      console.log("Server is running on port: ", PORT);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!", err);
  });
