const express = require("express");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const PORT = 7777;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Get user by emailId
// app.get("/user", async (req, res) => {
//   const { emailId } = req.body;
//   try {
//     const user = await User.findOne({ emailId });
//     res.send(user);
//   } catch (err) {
//     res.status(400).send("Error fetching user: " + err.message);
//   }
// });

// Get all the users
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find();
//     if (users.length) {
//       res.send(users);
//     } else {
//       res.status(404).send("No users found");
//     }
//   } catch (err) {
//     res.status(400).send("Error fetching users: " + err.message);
//   }
// });

// Delete user by _id
// app.delete("/user", async (req, res) => {
//   const { userId } = req.body;

//   try {
//     const user = await User.findByIdAndDelete(userId);
//     res.send("User deleted successfully");
//   } catch (err) {
//     res.status(400).send("Error deleting user: " + err.message);
//   }
// });

// Update user by _id
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
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
//     res.status(400).send("Something went wrong");
//   }
// });

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
