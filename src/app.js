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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //create a JWT Token
      const token = await jwt.sign({ _id: user._id }, "DevX@200$3");
      //Add the token to cookie and send the response back to the user
      res.cookie("token", token);
      res.send("User successfully logged in");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/profile", async (req, res) => {
  
  try{
  const cookies = req.cookies;
  const { token } = cookies;
  if(!token) {
    throw new Error("Invalid Token");
  }
  //validating hte token
  const decodedMessage = jwt.verify(token,"DevX@200$3");
  const { _id } = decodedMessage;
  //console.log("Logged in User is: " + _id);
  const user = await User.findById(_id);
  if(!user){
    throw new Error("User does not exist"); 
  }
  //console.log("User is: " + user);
  res.send("User got profile");
  } catch(err){
    res.status(400).send(err.message);
  }
});

//delete a user
app.delete("/user", async (req, res) => {
  const userId = req.body?.userId;
  try {
    const user = await User.findByIdAndDelete({
      _id: userId,
    });
    res.send("User deleted Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
//get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({
      emailId: userEmail,
    });

    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
//Fetch api
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//update user
app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  const userId = req.params?.userId;

  try {
    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "firstName",
      "lastName",
      "userId",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    const user = await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      data,
      { returnDocument: "before", runValidators: true }
    );
    console.log(user);
    res.send("User updated");
  } catch (err) {
    res.status(400).send("Something went wrong : " + err.message);
  }
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
