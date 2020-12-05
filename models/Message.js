const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MessageSchema = new mongoose.Schema(
  {
    dnis: {
      type: String,
      required: true,
    },

    message_id: { type: String, required: true },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Message", MessageSchema);
