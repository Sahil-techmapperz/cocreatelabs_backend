const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Set up Multer with flexible file type acceptance
const uploadfiles = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 * 1024 }, // Limit to 1 GB
  }).fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]);

// Middleware to upload video to S3
const uploadVideoToS3 = (req, res, next) => {
  if (!req.files || !req.files.video) {
    return res.status(400).send({ message: 'No video file uploaded.' });
  }

  const video = req.files.video[0];
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: video.filename,
    Body: fs.createReadStream(video.path),
    ContentType: video.mimetype, // Allow all MIME types
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading video to S3:', err);
      return res.status(500).send({ message: 'Error uploading video to S3' });
    }

    req.videoUrl = data.Location;

    // Clean up local storage
    fs.unlink(video.path, (err) => {
      if (err) console.error('Error removing temporary video file:', err);
    });

    next(); // Continue to the next middleware or route handler
  });
};

// Middleware to upload image to S3
const uploadImageToS3 = (req, res, next) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send({ message: 'No image file uploaded.' });
  }

  const image = req.files.image[0];
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: image.filename,
    Body: fs.createReadStream(image.path),
    ContentType: image.mimetype, // Allow all MIME types
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading image to S3:', err);
      return res.status(500).send({ message: 'Error uploading image to S3' });
    }

    req.imageUrl = data.Location;

    // Clean up local storage
    fs.unlink(image.path, (err) => {
      if (err) console.error('Error removing temporary image file:', err);
    });

    next(); // Continue to the next middleware or route handler
  });
};


module.exports = { uploadfiles, uploadVideoToS3,uploadImageToS3 };