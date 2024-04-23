const express = require('express');
const Contact = require('../models/Contact.js');

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send("Hello Contact");
})
router.get("/totalcount", async (req, res) => {
    try {
        const count = await Contact.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.error("Failed to count documents:", error);
        res.status(500).json({ error: "Error counting documents", details: error.message });
    }
});

// POST request to create a new contact
router.post('/add', async (req, res) => {
    try {
        const {
            email,
            country,
            name,
            companyName,
            phoneNumber,
            interestedIn,
           message
        } = req.body;

        // Create a new Contact document
        const newContact = new Contact({
            email,
            country,
            name,
            companyName,
            phoneNumber,
            interestedIn,
           message
        });

        // Save the new contact to the database
        const savedContact = await newContact.save();

        res.status(201).json(savedContact); // Send the saved contact as a JSON response
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// GET request to retrieve all contacts
router.get('/getDetails', async (req, res) => {
    try {
        // Retrieve all contacts from the database
        const contacts = await Contact.find();

        res.status(200).json(contacts); // Send the contacts as a JSON response
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});




// PATCH request to update an existing contact
router.patch('/contacts/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const updates = req.body;

        // Extracting fields from the updates object
        const { name, email, country, phoneNumber, companyName, interestedIn,message } = updates;

        // Find the contact by ID and update it
        const updatedContact = await Contact.findByIdAndUpdate(contactId, updates, { new: true });

        // Check and update each field individually if it's not null or undefined
        if (name !== null && name !== undefined) updatedContact.name = name;
        if (email !== null && email !== undefined) updatedContact.email = email;
        if (country !== null && country !== undefined) updatedContact.country = country;
        if (phoneNumber !== null && phoneNumber !== undefined) updatedContact.phoneNumber = phoneNumber;
        if (companyName !== null && companyName !== undefined) updatedContact.companyName = companyName;
        if (interestedIn !== null && interestedIn !== undefined) updatedContact.interestedIn = interestedIn;
        if (Message !== null &&message !== undefined) updatedContact.Message =message;

        if (!updatedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json(updatedContact); // Send the updated contact as a JSON response
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// DELETE request to remove an existing contact
router.delete('/delete/:id', async (req, res) => {
    try {
        const contactId = req.params.id;

        // Find the contact by ID and remove it
        const deletedContact = await Contact.deleteOne({ _id:contactId});

        if (!deletedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.status(200).json({message: 'Contact deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = router;