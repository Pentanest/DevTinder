const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  const currentUser = this;
  if (currentUser.fromUserId.equals(currentUser.toUserId)) {
    throw new Error("You cannot send connection request to yourself!!");
  }
  next();
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;
