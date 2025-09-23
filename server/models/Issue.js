const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    images: [{
      type: String,
      required: false,
    }],
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
    category: {
      type: String,
      enum: ["Roads", "Water", "Electricity", "Sanitation", "Public Property", "Other"],
      default: "Other",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    assignedDepartment: {
      type: String,
      required: false,
    },
    estimatedResolutionTime: {
      type: String,
      required: false,
    },
    resolutionNotes: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
