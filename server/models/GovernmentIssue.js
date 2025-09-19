// server/models/GovernmentInfra.js
const mongoose = require('mongoose');

const governmentInfraSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    images: [{ type: String }],
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Planned', 'Under Construction', 'Completed'],
        default: 'Planned'
    }
}, { timestamps: true });

module.exports = mongoose.model('GovernmentInfra', governmentInfraSchema);