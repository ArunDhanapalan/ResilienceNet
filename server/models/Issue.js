const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    title: String,
    description: String,
    image: String,
    location: {
        lat: Number,
        lng: Number
    },
    status: {
        type: String,
        enum: ['Reported', 'In Progress', 'Resolved'],
        default: 'Reported'
    },
    reporter: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Issue = mongoose.model('Issue', issueSchema);
module.exports = Issue;
