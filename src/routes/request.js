const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const status = req.params.status;
    const toUserId = req.params.toUserId;

    const allowedStatusTypes = ["interested", "ignored"];
    if (!allowedStatusTypes.includes(status)) {
      throw new Error("Invalid status type " + status);
    }

    // if (fromUserId.equals(toUserId)) {
    //   throw new Error("You cannot send connection request to yourself!!");
    // }

    const toUser = await User.findById(new mongoose.Types.ObjectId(toUserId));
    if (!toUser) {
      throw new Error("User not found!");
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      throw new Error(
        "Either you have already sent a connection request to this person or you have a pending connection request from this person"
      );
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const newConnectionRequest = await connectionRequest.save();

    res.json({
      message:
        status === "interested"
          ? `${req.user.firstName} is interested in ${toUser.firstName}`
          : `${req.user.firstName} ignored ${toUser.firstName}`,
      data: newConnectionRequest,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const status = req.params.status;
    const requestId = req.params.requestId;

    const allowedStatusTypes = ["accepted", "rejected"];
    if (!allowedStatusTypes.includes(status)) {
      throw new Error("Invalid status");
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: new mongoose.Types.ObjectId(requestId),
      status: "interested",
      toUserId: loggedInUser._id,
    });
    if (!connectionRequest) {
      throw new Error("Connection request not found");
    }

    connectionRequest.status = status;

    await connectionRequest.save();

    res.json({
      message: `Request ${status}!`,
    });
  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

module.exports = requestRouter;
