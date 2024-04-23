const express = require('express');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret';
const AdminMiddleware = require("../middlewares/AdminAuthorization_middleware")
const { upload, uploadToS3 } = require('../middlewares/UploadfiletoS3'); // Adjust the path as necessary
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // Fetch all admins from the database
        const admins = await Admin.find();
        // Ensure admins is an array before sending
        if (!Array.isArray(admins)) {
            throw new Error('Admins data is not an array');
        }
        res.status(200).json({ message: 'Hello from admin', admins });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/profile/profileimageupdate', upload.single('file'), uploadToS3, (req, res) => {
    let url = req.fileUrl;
    res.status(200).send({ url });


});
router.patch('/profile/update', AdminMiddleware, async (req, res) => {
    try {
        const { id } = req.user;
        const {
            fullName,
            email,
            username,
            phoneNumber,
            address,
            dateOfBirth,
            role,
            profileUrl
        } = req.body;

        // Constructing update data with non-null and non-undefined fields
        const updateData = {};
        if (fullName !== null && fullName !== undefined) updateData.fullName = fullName;
        if (email !== null && email !== undefined) updateData.email = email;
        if (username !== null && username !== undefined) updateData.username = username;
        if (phoneNumber !== null && phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
        if (address !== null && address !== undefined) updateData.address = address;
        if (dateOfBirth !== null && dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
        if (role !== null && role !== undefined) updateData.role = role;
        if (profileUrl !== null && profileUrl !== undefined) updateData.profileUrl = profileUrl;

        // Check if the document exists before updating
        const adminExists = await Admin.exists({ _id: id });
        if (!adminExists) {
            return res.status(404).send('Admin profile not found.');
        }

        // Update the profile in the Admin model
        const updateResult = await Admin.updateOne({ _id: id }, { $set: updateData });

        if (!updateResult.modifiedCount) {
            throw new Error("Profile update failed or no changes made.");
        }

        // Fetch the updated admin data
        const updatedAdmin = await Admin.findById(id);
        if (!updatedAdmin) {
            throw new Error("Failed to retrieve updated profile.");
        }

        // Be cautious about sending sensitive information; omit it as necessary
        const adminDataToSend = {
            ...updatedAdmin.toObject(),
        };
        delete adminDataToSend.password; // Remove sensitive fields like password

        res.status(200).send({ admin: adminDataToSend });
    } catch (error) {
        console.error("Error updating or retrieving admin profile:", error.message);
        res.status(500).send('Error updating or retrieving admin profile');
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return res.status(401).send('Authentication failed');
        }

        const isMatch = password == admin.password;
        if (!isMatch) {
            return res.status(401).send('Authentication failed');
        }

        // console.log(admin);
        // Create JWT token
        const token = jwt.sign({ id: admin._id, role: admin.role ,profileUrl:admin.profileUrl,fullName:admin.fullName}, JWT_SECRET, { expiresIn: '1h' });

        // Send token to client
        res.status(200).send({ token, user: admin, message: "Login Successful" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Admin signup route
router.post('/signup', async (req, res) => {
    const { email } = req.body;
    console.log(email);

    try {
        // Check if the admin already exists
        let admin = await Admin.findOne({ email: email.toLowerCase() });
        if (admin) {
            return res.status(400).send('Admin already exists');
        }




        // Create a new admin with required fields
        admin = new Admin(req.body);



        await admin.save();
        res.status(201).send('Admin registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});











module.exports = router;
