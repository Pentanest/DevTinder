const express = require("express");
const connectDB = require("./config/database");
const PORT = 7777;
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = { firstName: "Asheesh", lastName: "Sahu", emailId: "asheesh@sahu.com", password: "asheesh@123" };

  const user = new User(userObj); // creating a new instance of the user model

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error adding user: ", err?.message);
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
