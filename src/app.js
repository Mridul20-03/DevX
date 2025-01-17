const express = require('express');
//create an express js application
const app = express();

const port = 3000;



// this app.get() will only match get api call to /user

app.get('/user',(req,res) => {
    res.send({ firstname : "Mridul" , lastname : "Jain", });
});

app.post("/user",(req,res) => {
    console.log("Save data to database"); 
    res.send("Data successfully saved");
});

// this app.use() will match all HTTP methods to 
app.use((req,res) => {
    res.send("Welcome to DevX");
});

app.listen(3000, () => {
    console.log('Server Running successfully');
});

