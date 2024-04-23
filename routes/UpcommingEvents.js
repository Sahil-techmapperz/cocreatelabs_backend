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











module.exports = router;