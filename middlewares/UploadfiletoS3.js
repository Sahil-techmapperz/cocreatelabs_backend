const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Update AWS config
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();


// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Temporary storage path
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Middleware for uploading files to S3
const uploadToS3 = (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.file;

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.filename, // Use the filename from multer to ensure uniqueness
        Body: fs.createReadStream(file.path),
        ContentType: file.mimetype,
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error uploading to S3');
        }

        // Attach the URL to the request so it can be used in subsequent middleware or route handler
        req.fileUrl = data.Location;

        // Clean up the uploaded file from local storage
        fs.unlink(file.path, (err) => {
            if (err) console.error('Error removing temporary file:', err);
        });

        next(); // Proceed to the next middleware or route handler
    });
};
const uploadimageToS3 = (req, res, next) => {
    if (!req.image) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.image;

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.filename, // Use the filename from multer to ensure uniqueness
        Body: fs.createReadStream(file.path),
        ContentType: file.mimetype,
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error uploading to S3');
        }

        // Attach the URL to the request so it can be used in subsequent middleware or route handler
        req.imageUrl = data.Location;

        // Clean up the uploaded file from local storage
        fs.unlink(file.path, (err) => {
            if (err) console.error('Error removing temporary file:', err);
        });

        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = { upload, uploadToS3,uploadimageToS3 };
