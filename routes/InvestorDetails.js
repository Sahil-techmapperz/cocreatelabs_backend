const express = require('express');
const Investor = require('../models/InvestorDetails');


const router = express.Router();

// GET all investors
router.get('/investors', async (req, res) => {
    try {
        const investors = await Investor.find({});
        res.json(investors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// POST a new investor
router.post('/add', async (req, res) => {
    const { name, email, phone, budget, companySize, message } = req.body;




    try {
        const newInvestor = new Investor({
            name,
            email,
            phone,
            budget,
            companySize,
            message
        });

        const savedInvestor = await newInvestor.save();
        res.status(201).json(savedInvestor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// DELETE an investor by ID
router.delete('/investors/:id', async (req, res) => {
    const investorId = req.params.id;

    try {
        const deletedInvestor = await Investor.findByIdAndDelete(investorId);
        if (!deletedInvestor) {
            return res.status(404).json({ message: "Investor not found" });
        }
        res.json({ message: "Investor deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;