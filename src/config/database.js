const mongoose = require("mongoose");

const URI = "mongodb+srv://admin-shubhankar:Shubho123@cluster0.bvdhz.mongodb.net/devTinder";

const connectDB = async () => {
  await mongoose.connect(URI);
};

module.exports = connectDB;
