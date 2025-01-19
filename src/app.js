const express = require('express');
const connectDb = require('./config/database.js');
const User = require('./models/user.js');
// Create an Express.js application
const app = express();
const port = 3000;

// now we can use json object to convert it to js object
app.use(express.json());


app.post("/signup", async (req,res) => {

/*console.log(req.body); 
     const { firstName , lastName , email , password } = req.body;
     const userObj = {
        firstName : firstName,
        lastName : lastName,
        email : email,
        password : password,
     };
*/
// createing a new instance of userModel
    const user = new User(req.body);
    await user.save();
    res.send("User created");

});




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
