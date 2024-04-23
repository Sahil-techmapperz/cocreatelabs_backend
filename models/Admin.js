const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: false,
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String
    },
    dateOfBirth: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        required: true,
        default:"Admin",
        enum: ['Admin', 'superadmin'] // Example roles
    },
    lastLogin: {
        type: Date,
        required: false
    },
    profileUrl: {
        type: String,
        required: false,
        trim: true,
        default:""
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

const Admin = mongoose.model('Adminuser', AdminSchema);

module.exports = Admin;
