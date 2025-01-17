
const express = require('express');
//create an express js application
const app = express();

const port = 3000;

const  { adminAuth } = require('./middlewares/auth.js');


//Handle Auth Middleware for all requests Get and post etc
app.use("/admin",adminAuth);

app.get("/admin/getAllData",(req, res, next) => {
    res.send("Send all data");
});

app.get("/admin/deleteData",(req, res, next) => {
    res.send("Deleted data");
});

app.use("/user",(req,res) => {
    res.send('Welcome');
});

app.listen(3000, () => {
    console.log('Server Running successfully');
});

