const express = require("express");
const connectDB = require("./config/database");
const PORT = 7777;
const User = require("./models/user");
const user = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body); // creating a new instance of the user model

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error adding user: ", err?.message);
  }
});

// app.get("/user", async (req, res) => {
//   const { emailId } = req.body;
//   try {
//     const user = await User.findOne({ emailId });
//     res.send(user);
//   } catch (err) {
//     res.status(400).send("Error fetching user: ", err.message);
//   }
// });

// Get user by emailId
app.get("/user", async (req, res) => {
  const { emailId } = req.body;
  try {
    const user = await User.findOne({ emailId });
    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching user: ", err.message);
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
    res.status(400).send("Error fetching users: ", err.message);
  }
});

// Delete user by _id
app.delete("/user", async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Error deleting user: ", err.message);
  }
});

app.patch("/user", async (req, res) => {
  const { userId } = req.body;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, data, { returnDocument: "after" });
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
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
