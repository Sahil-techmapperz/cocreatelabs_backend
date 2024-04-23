// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();

// Route handlers
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const AdminRoutes = require('./routes/Admin');
const SubscribeRoutes = require('./routes/Subscribe');
const Contact =require('./routes/Contact')
const TestimonialVedio =require('./routes/Testimonial')
const InvestorDetails =require('./routes/InvestorDetails')
// Initialize express app
const app = express();

// Middleware configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json()); // Using express's built-in body parser
app.use(passport.initialize());

// Define routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', AdminRoutes);
app.use('/subscribe', SubscribeRoutes);
app.use('/contact', Contact);
app.use('/testimonialVedio', TestimonialVedio );
app.use('/investorDetails', InvestorDetails);


app.get("/", (req, res) => {
  return res.status(200).send({ message: 'Hello from Co-Createlabs Backend' });
});

// MongoDB connection and server start
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Could not connect to MongoDB', err);
    process.exit(1);
  }
};

startServer();
