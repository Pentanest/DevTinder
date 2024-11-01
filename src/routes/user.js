const express = require("express");
const userRouter = express.Router();
const mongoose = require("mongoose");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if (!connectionRequests.length) {
      return res.status(404).json({ message: "No connection requests found!" });
    }
    res.send(
      connectionRequests.map((item) => ({ fromUserId: item.fromUserId, toUserId: item.toUserId, status: item.status }))
    );
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const acceptedConnections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .populate("fromUserId", ["firstName", "lastName", "gender", "skills", "about"])
      .populate("toUserId", ["firstName", "lastName", "gender", "skills", "about"]);

    if (!acceptedConnections.length) {
      throw new Error("No connections found!");
    }
    res.send(
      acceptedConnections.map((item) => {
        return item._id.toString() === loggedInUser._id.toString() ? item.fromUserId : item.toUserId;
      })
    );
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = req.query.page || 1;
    let limit = req.query.limit || 5;
    limit = limit > 5 ? 5 : limit;
    const skip = (page - 1) * limit;
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }).select("fromUserId toUserId");

    const uniqueConnectionIds = new Set();
    connections.forEach((item) => {
      uniqueConnectionIds.add(item.fromUserId.toString());
      uniqueConnectionIds.add(item.toUserId.toString());
    });
    const hideUsersFromFeed = Array.from(uniqueConnectionIds);

    const feedUsers = await User.find({
      $and: [{ _id: { $nin: hideUsersFromFeed } }, { _id: { $ne: loggedInUser._id } }],
    })
      .select("firstName lastName skills about gender photoUrl")
      .skip(skip)
      .limit(limit);

    res.send(feedUsers);
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

module.exports = userRouter;
