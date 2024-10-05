const express = require("express");
const PORT = 7777;

const app = express();

app.use("/admin", (req, res, next) => {
  console.log("Authorized");
  next();
});

app.get("/admin/getData", (req, res, next) => {
  console.log("In this");
  // throw new Error();
  res.send("Hello server");
  next();
});

app.get("/us*er", (req, res) => {
  res.send("User working");
});

app.use("/", (err, req, res, next) => {
  // if (err) {
  res.send("Something wrong");
  // }
});

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});
