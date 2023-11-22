const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const { body, validationResult } = require("express-validator");

// Require database connect
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");

// Use environment variables for sensitive information
const jwtSecret = process.env.JWT_SECRET || "kimenyublogs";

// Execute database connection
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });
  
// Create an Express app
const app = express();

// Middleware to parse JSON in request bodies
app.use(express.json());

// Register endpoint with input validation
app.post(
  "/register",
  [
    // Validate email and password
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (request, response) => {
    // Check for validation errors
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(request.body.password, 10);

      // Create a new user instance
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });

      // Save the new user
      const result = await user.save();

      // Return success if the new user is added to the database successfully
      response.status(201).json({
        message: "User Created Successfully",
        result,
      });
    } catch (error) {
      console.error("Registration error:", error);
      response.status(500).json({
        message: "Error creating user",
      });
    }
  }
);

// Login endpoint
app.post("/login", async (request, response) => {
  try {
    // Check if email exists
    const user = await User.findOne({ email: request.body.email });

    if (!user) {
      return response.status(404).json({
        message: "Email not found",
      });
    }

    // Compare the password entered and the hashed password found
    const passwordCheck = await bcrypt.compare(request.body.password, user.password);

    if (!passwordCheck) {
      return response.status(400).json({
        message: "Passwords do not match",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
      },
      jwtSecret,
      { expiresIn: "1d" } // Adjust the expiry time as needed
    );

    // Return success response
    response.status(200).json({
      message: "Login successful",
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    response.status(500).json({
      message: "Internal server error",
    });
  }
});

// free endpoint
app.get("/free-endpoint", (request, response) => {
    response.json({ message: "You are free to access me anytime" });
  });
  
  // authentication endpoint
  app.get("/auth-endpoint", auth, (request, response) => {
    response.json({ message: "You are authorized to access me" });
  });

// Define the port to listen on
const PORT = process.env.PORT || 5000;

// Start listening to the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the Express app
module.exports = app;
