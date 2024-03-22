const express = require('express');
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const router = express.Router();

const uri = 'mongodb://localhost:27017/loginSystem';
const client = new MongoClient(uri);

client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
  } else {
    console.log('Connected to MongoDB');
  }
});

const validateSignup = [
  body('name').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('dob').notEmpty().withMessage('Date of birth is required'),
];

router.get('/', (req, res) => {
  if (req.session.isAuth) {
    res.redirect('/dashboard');
    return;
  }
  res.render('base', { title: 'Login System' });
});


router.get('/dashboard', (req, res) => {
  if (req.session.user) {
    // Render admin dashboard
    res.render('adminDashboard', { user: req.session.user });
  } else {
    res.redirect('/');
  }
});

// router.post('/validateSignup', validateSignup, (req, res) => {
//   // Validation logic for admin signup
//   // ...
// });
// In admin.js
router.get('./adminLogin', (req, res) => {
  console.log("Admin Login route hit");
  if (req.session.isAuth) {
    console.log("Redirecting to /adminmgmt");
    res.redirect("views./adminLogin/adminmgmt");
  } else {
    console.log("Rendering adminLogin view");
    res.render("adminLogin", { title: "Admin Page" });
  }
});


process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
});

module.exports = router;
