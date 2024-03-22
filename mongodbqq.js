const express = require('express');
const app = express();
const port = 8000;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/loginSystem', {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

  const LoginSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true      
    },
    isAdmin: {
      type: Boolean,
      default:false,
      required:false      
      }
  });
  
// Use uppercase for the model name
const UserModel = mongoose.model("User", LoginSchema);

// You can export the model directly if needed
module.exports = UserModel;

// echeckinusage within a function or route
// app.get('/getUser', async (req, res) => {
//   try {
//     const user = await UserModel.findOne({ email: "afaf@gmail.com" });
//     console.log(user.email);
//     res.json(user);
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});