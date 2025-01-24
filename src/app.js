const express = require("express");
const connectDb = require("./config/database.js");
const User = require("./models/user.js");
const {
  validateSignUpData,
  validateSignInData,
} = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");

// Create an Express.js application
const app = express();
const port = 3000;

// now we can use json object to convert it to js object
app.use(express.json());
//now we can read cookies
app.use(cookieParser());

//add a user
app.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
     //encrypt password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.send("User created");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    validateSignInData(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    
    if (isPasswordValid) {
      const token = await user.getJWT(); 
      res.cookie("token", token);
      res.send("User successfully logged in");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/sendConnectionRequest", userAuth , async (req, res) => {
  const user = req.user;
  // Send the connection request
  console.log("Send connection request");
  res.send(user.firstName + " sent the connection request");
});



// Connect to the database first, then start the server
connectDb()
  .then(() => {
    console.log("Database Connection established");

    // Start the server only after a successful database connection
    app.listen(port, () => {
      console.log("Server Running successfully");
    });
  })
  .catch((err) => {
    console.error("Error connecting Database Connection:", err.message);
  });
