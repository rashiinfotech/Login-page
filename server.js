const express = require("express");
const session = require("express-session");
const path = require("path");
const nocache = require("nocache");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser')

const expressValidator = require('express-validator');
const app = express();

app.use(nocache());

const PORT = process.env.PORT || 8000;

const uri = "mongodb://localhost:27017/loginSystem";
const client = new MongoClient(uri);

client.connect((err) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
  } else {
    console.log("Connected to MongoDB");
  }
});

// app.use(expressValidator());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use("/views", express.static(path.join(__dirname, "views")));
//sessions
app.use(
  session({
    secret: "qazxswedcvfrTGBNHYUJM,KI",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  if (req.session.isAuth) {
    res.redirect("/dashboard");
    return;
  }
  res.render("base", { title: "Login System" });
});

app.get("/adminSignup", (req, res) => {
  const successMessage = req.session.successMessage;
  delete req.session.successMessage;
  if (req.session.isAuth) {
    res.redirect("/adminmgmt");
    return;
  }
  res.render("adminSignup", { title: "admin signup page", successMessage });
});
app.get("/adminLogin", (req, res) => {
  if (req.session.isAuth) {
    res.redirect("/adminmgmt");
    return;
  }
  if (req.session.user) {
    res.redirect("/adminmgmt");
    return;
  }
  res.render("adminLogin", { title: "admin page" });
});
app.post('/login', async (req, res) => {
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

  
const collection = client.db("loginSystem").collection("users");

// Login route
/// Update your admin login route
// Admin login route
app.post("/adminLogin", async (req, res) => {
  const { email, password } = req.body;

  try {

      // Access the users collection in the loginSystem database
      const collection = client.db("loginSystem").collection("users");

      // Find the user by email
      const admin = await collection.findOne({ email });

      // Check if the user exists
      if (!admin) {
          return res.status(401).json({ success: false, message: "Invalid email or password" });
      }

      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, admin.password);

      if (!passwordMatch) {
          return res.status(401).json({ success: false, message: "Invalid email or password" });
      }

      // Check if the user is an admin
      if (admin.isAdmin) {
          req.session.user = admin; // Set the entire user object in the session
          res.json({ success: true, message: "Admin login successful" });
      } else {
          res.status(403).json({ success: false, message: "User does not have admin privileges" });
      }
  } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// Validation middleware for signup route
const { body, validationResult } = require('express-validator');


const validateSignup = [
  body('name').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('dob')
    .notEmpty().withMessage('Date of birth is required')
    .custom((dob) => {
      // Assuming the date format is YYYY-MM-DD
      const regex = /^\d{4}-\d{2}-\d{2}$/;

      if (!regex.test(dob)) {
        throw new Error('Invalid date of birth format');
      }

      // Convert the input date string to a Date object
      const dobDate = new Date(dob);
      const today = new Date();

      if (dobDate > today) {
        throw new Error('Date of birth cannot be after today');
      }

      // Additional validation logic if needed

      return true;
    }),
];

app.post("/signup", validateSignup, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    // Send the errors as part of the response
    return res.status(400).render("signup", {
      title: "Signup Form",
      errors: errors.array(),
    });
  }

  try {
    const { name, lastName, email, password, dob } = req.body;
    const db = client.db("loginSystem");
    const collection = db.collection("users");

    const existingUser = await collection.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).render("signup", {
        title: "Signup Form",
        errorMessage: "User with the same email already exists",
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

      req.session.successMessage = "Successfully registered!";
      res.redirect("/signup");
    }
  } catch (error) {
    console.error("Error in signup route:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/signup", (req, res) => {
  // Retrieve success message and clear it from the session
  const successMessage = req.session.successMessage;
  delete req.session.successMessage;

  if (req.session.isAuth) {
    res.redirect("/dashboard");
    return;
  }

  res.render("signup", { title: "Signup Form", successMessage });
});

app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.render("dashboard", { user: req.session.user });
  } else {
    res.redirect("/");
  }
});
//admin edit user
app.get("/admin/edit/:userId", async (req, res) => {
  if (req.session.user && req.session.user.isAdmin) {
    const userId = req.params.userId;

    // Fetch user details based on userId
    try {
      const user = await getUserById(userId);

      if (user) {
        res.render("editUser", { user });
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error("Error rendering editUser page:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(403).send("Forbidden");
  }
});


// admin delete user
app.get("/admin/delete/:userId", async (req, res) => {
  if (req.session.user && req.session.user.isAdmin) {
    const userId = req.params.userId;

    try {
      // Connect to the MongoDB server
      await client.connect();

      // Access the database and collection
      const database = client.db("loginSystem");
      const collection = database.collection("users");

      // Perform the deletion
      const result = await collection.deleteOne({ _id: new ObjectId(userId) });

      if (result.deletedCount === 1) {
        console.log(`User with ID ${userId} deleted successfully`);
      } else {
        console.log(`User with ID ${userId} not found`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Internal Server Error");
      return;
    } finally {
      // Close the connection
      // await client.close();
    }

    res.redirect("/adminmgmt");
  } else {
    res.status(403).send("Forbidden");
  }
});

app.post("/admin/update/:userId", async (req, res) => {
  if (req.session.user && req.session.user.isAdmin) {
    const userId = req.params.userId;

    try {
      // Connect to the MongoDB server
      await client.connect();

      // Access the database and collection
      const database = client.db("loginSystem");
      const collection = database.collection("users");

      // Extract updated fields from the request body
      let updatedFields = req.body;

      // Check if the password field is present and hash it
      if (updatedFields.password) {
        updatedFields.password = await bcrypt.hash(updatedFields.password, 10);
      }

      // Perform the update
      const result = await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updatedFields }
      );

      if (result.matchedCount === 1) {
        console.log(`User with ID ${userId} updated successfully`);
        res.redirect("/adminmgmt"); // Redirect to user management page after a successful update
      } else {
        console.log(`User with ID ${userId} not found`);
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error - User Update" });
    } finally {
      // Close the connection
      // await client.close();
    }
  } else {
    res.status(403).send("Forbidden");
  }
});




async function getUserById(userId) {
  try {
    const database = client.db("loginSystem");
    const collection = database.collection("users");
    return await collection.findOne({ _id: new ObjectId(userId) });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}
function deleteUserData(userId) {
  // Placeholder for deleting user data
  // Replace this with your actual logic for deleting user data
  console.log(`Deleted user with ID: ${userId}`);
}

//admin add user user
app.get("/admin/add", (req, res) => {
  // Retrieve success message and clear it from the session
  const successMessage = req.session.successMessage;
  delete req.session.successMessage;

 

  res.render("signup", { title: "Signup Form", successMessage });
});


async function getUsers() {
  try {
    const database = client.db("loginSystem");
    const collection = database.collection("users");
    return await collection.find().toArray();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // Propagate the error
  }
}

app.get("/adminmgmt", async (req, res) => {
  try {
    // Retrieve the list of users
    const users = await getUsers();

    // Check if the user is authenticated, exists, and has admin privileges
if (req.session.user && req.session.user.isAdmin) {
  res.render("adminmgmt", { user: req.session.user, users });
} else {
  res.status(403).send("Forbidden");
}


  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send("Error");
    } else {
      res.redirect("/");
    }
  });
  
});
app.get("/logoutAdmin", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send("Error");
    } else {
      res.redirect("/adminLogin"); // Fixed the syntax error here
    }
  });
});

app.post("/validateSignup", validateSignup, (req, res) => {
  // Return validation errors if any
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  // No errors, return success
  res.status(200).json({ message: 'Validation passed' });
});


// Close the MongoDB connection when the application is shutting down
process.on("SIGINT", async () => {
  try {
    await client.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    process.exit(1);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
