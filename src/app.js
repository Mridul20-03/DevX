const express = require('express');
const connectDb = require('./config/database.js');
const User = require('./models/user.js');
// Create an Express.js application
const app = express();
const port = 3000;

// now we can use json object to convert it to js object
app.use(express.json());

//add a user
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
//delete a user
app.delete("/user", async (req, res) => {
    const userId = req.body?.userId;
    try{
        const user = await User.findByIdAndDelete({
            _id : userId
        });
        res.send("User deleted Successfully");
    }catch(err){
        res.status(400).send("Something went wrong");
    }
     


});
//get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try{
        const user = await User.findOne({
        emailId : userEmail });

        if(user.length === 0){
            res.status(404).send("User not found");
        }
        else{
            res.send(user);
        }
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
    
});
//Fetch api
app.get("/feed" , async (req,res) => {
    try{
        const users = await User.find({});

        if(users.length === 0){
            res.status(404).send("User not found");
        }
        else{
            res.send(users);
        }
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});
//update user
app.patch("/user", async (req,res) => {
    const data = req.body;
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndUpdate({
            _id : userId
        },data, { returnDocument : "before"});
        console.log(user);
        res.send("User updated");
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
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
