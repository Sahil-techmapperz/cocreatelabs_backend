const mongoose = require('mongoose');

const UpcommingSchema = new mongoose.Schema({
    header1: {
        type: String,
        required: true,

    },
    header2: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true,
        trim: true
    },

    imageUrl: {
        type: String,
        required: false,
        trim: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

const UpcommingEvent = mongoose.model('EventsUser', UpcommingSchema);

module.exports = UpcommingEvent;
