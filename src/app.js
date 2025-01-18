const express = require('express');
const connectDb = require('./config/database.js');
const User = require('./models/user.js');
// Create an Express.js application
const app = express();
const port = 3000;


app.post("/signup", async (req,res) => {
    const userObj = {
        firstName : "Rohit",
        lastName : "Sharma",
        emailId : "rohitsharma202003@gmail.com",
        password : "9093931902",  
    }; 
// createing a new instance of userModel
    const user = new User(userObj);

   await user.save();
    res.send("User created");

})




// Connect to the database first, then start the server
connectDb()
    .then(() => {
        console.log("Database Connection established");

        // Start the server only after a successful database connection
        app.listen(port, () => {
            console.log('Server Running successfully');
        });
    })
    .catch((err) => {
        console.error("Error connecting Database Connection:", err.message);
    });
