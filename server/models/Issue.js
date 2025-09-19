const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    // Changed from a single String to an array of Strings
    images: [
      {
        type: String,
        required: true,
      },
    ],
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Reported", "In Progress", "Resolved"],
      default: "Reported",
    },
    area: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);

const Issue = mongoose.model("Issue", issueSchema);
module.exports = Issue;
