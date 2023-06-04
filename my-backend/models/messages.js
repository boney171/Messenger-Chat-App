const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
/*
messageSchema.pre("save", async function (next) {
  try {
    // Populate the sender and room fields with the actual documents
    await this.populate("sender").execPopulate();
    await this.populate("room").execPopulate();
    next();
  } catch (err) {
    next(err);
  }
});
*/
module.exports = mongoose.model("Messages", messageSchema);