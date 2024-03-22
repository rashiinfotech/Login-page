const express = require('express');
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const helmet = require('helmet');
// app.use(helmet());


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

router.post('/login', async (req, res) => {
  if (req.session.isAuth) {
    // Handle the case where the user is already authenticated
    res.redirect('/dashboard');
    return;
  }

  const { email, password } = req.body;

  try {
    const db = client.db();
    const collection = db.collection('users');

    const user = await collection.findOne({ email: email.toLowerCase() });

    if (user && user.password) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        req.session.user = user.email;
        req.session.isAuth = true;
        res.json({ message: 'Login successful', user: req.session.user });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error in login route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/signup', validateSignup, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Send the errors as part of the response
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, lastName, email, password, dob } = req.body;
    const db = client.db('loginSystem');
    const collection = db.collection('users');

    const existingUser = await collection.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        errorMessage: 'User with the same email already exists',
      });
    } else {
      const data = {
        name,
        lastName,
        email: email.toLowerCase(),
        password: await bcrypt.hash(password, 10),
        dob,
        isAdmin: false,
      };

      await collection.insertOne(data);

      req.session.successMessage = 'Successfully registered!';
      res.redirect('/signup');
    }
  } catch (error) {
    console.error('Error in signup route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/signup', (req, res) => {
  // Retrieve success message and clear it from the session
  const successMessage = req.session.successMessage;
  delete req.session.successMessage;

  if (req.session.isAuth) {
    res.redirect('/dashboard');
    return;
  }

  res.render('signup', { title: 'Signup Form', successMessage });
});

router.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.render('dashboard', { user: req.session.user });
  } else {
    res.redirect('/');
  }
});

router.post('/validateSignup', validateSignup, (req, res) => {
  // Return validation errors if any
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // No errors, return success
  res.status(200).json({ message: 'Validation passed' });
});

// Close the MongoDB connection when the application is shutting down
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
