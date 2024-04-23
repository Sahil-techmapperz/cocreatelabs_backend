const express = require('express');
const Testimonial = require('../models/Testimonial');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret';
const AdminMiddleware = require("../middlewares/AdminAuthorization_middleware")
const { upload, uploadToS3 } = require('../middlewares/UploadfiletoS3'); // Adjust the path as necessary
const { uploadfiles,uploadVideoToS3,uploadImageToS3 } = require('../middlewares/Fileupload'); // Adjust the path as necessary
const router = express.Router();



router.get('/videos', async (req, res) => { // Changed endpoint to '/videos'
    try {
        const result = await Testimonial.find({});
        res.status(200).json({ data: result }); // Changed status code to 200
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/videos', uploadfiles,uploadVideoToS3,uploadImageToS3, async (req, res) => {
    const {  nameOf } = req.body; // Extracting fields from request body
    const {videoUrl,imageUrl}=req;


    try {
        const newTestimonial = new Testimonial({
            nameOf: nameOf,
            BannerUrl: imageUrl,
            VedioUrl: videoUrl 
        });
        const result = await newTestimonial.save();
        res.status(201).json({ msg: "Success", data: result });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/videos/:id', async (req, res) => {
    const id = req.params.id; // Extracting ID from request parameters

    try {
        const result = await Testimonial.deleteOne({ _id: id }); // Using extracted ID to delete
        if (result.deletedCount === 1) {
            res.status(200).json({ msg: "Success" });
        } else {
            res.status(404).json({ msg: "Testimonial not found" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});




module.exports = router;
