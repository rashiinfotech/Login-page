// const express = require('express');
// const session = require('express-session');
// const path = require('path');
// const nocache = require('nocache');
// const bodyParser = require('body-parser');
// const userController = require('./user');
// const adminRouter = require('./admin');
// const { MongoClient } = require('mongodb');

// const app = express();

// // Middleware
// app.use(express.static('public'));
// app.use(nocache());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.set('view engine', 'ejs');
// app.use('/views', express.static(path.join(__dirname, 'views')));

// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/views', express.static(path.join(__dirname, 'views')));


// // Sessions
// app.use(
//   session({
//     secret: 'qazxswedcvfrTGBNHYUJM,KI',
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// // MongoDB Connection
// const uri = 'mongodb://localhost:27017/loginSystem';
// const client = new MongoClient(uri);

// client.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MongoDB:', err);
//     process.exit(1);
//   } else {
//     console.log('Connected to MongoDB');
//   }
// });

// // User routes
// app.use('/', userController);

// // Admin routes
// app.use('/user', userController);
// app.use('/admin', adminRouter);
// // Logout route
// app.get('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error('Error destroying session:', err);
//       res.status(500).send('Internal Server Error');
//     } else {
//       res.redirect('/');
//     }
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, (err) => {
//   if (err) {
//     console.error('Error starting the server:', err);
//   } else {
//     console.log(`Server running on http://localhost:${PORT}`);
//   }
// });

const express =require('express')
const fs= require('fs')
const app= express()

const read= fs.readFile("./text.txt","utf-8")
console.log(read)


