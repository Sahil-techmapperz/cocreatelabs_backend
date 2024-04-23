const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase:true
    },
    country: {
        type:String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: false,
        trim: true
    },
   
    interestedIn: {
        type: String,
        required: false,
        trim: true
    },
   
  message: {
        type: String,
        required: false,
        trim: true
    }
   
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

const Contact = mongoose.model('newContact', ContactSchema);

module.exports = Contact;
