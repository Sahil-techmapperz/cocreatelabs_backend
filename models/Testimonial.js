const mongoose = require('mongoose');

const TestimonialVedioSchema = new mongoose.Schema({
    nameOf: {
        type: String,
        required: true,
        trim: true
    },
    BannerUrl: {
        type: String,
        required: true,
        trim: true
    },
    VedioUrl: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

const Testimonial = mongoose.model('Testimonial', TestimonialVedioSchema)

module.exports = Testimonial;
