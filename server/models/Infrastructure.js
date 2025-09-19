const mongoose = require("mongoose");

const infrastructureSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    type: {
      type: String,
      enum: ["Road", "Bridge", "Building", "Park", "Water System", "Electricity Grid", "Sewage System", "Other"],
      required: true
    },
    description: { 
      type: String, 
      required: true 
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    area: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Planned", "Under Construction", "Completed", "Maintenance Required", "Out of Service"],
      default: "Planned"
    },
    budget: {
      type: Number,
      required: false,
    },
    estimatedCompletion: {
      type: Date,
      required: false,
    },
    contractor: {
      type: String,
      required: false,
    },
    images: [{
      type: String,
      required: false,
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    notes: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Infrastructure", infrastructureSchema);
