const mongoose = require('mongoose');

const InvestorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: false,
        trim: true
    },
    budget: {
        type: String,
        required: true
    },
    companySize: {
        type: String,
        required: true,
        default: "Admin",
        enum: ['Small', 'Medium', 'Large'] // Example roles
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

const Investor = mongoose.model('Investoruser', InvestorSchema);

module.exports = Investor;
