const express = require('express');
//create an express js application
const app = express();

const port = 3000;

app.use("/user",(req,res,next) => {
    console.log("Handling route user 1");
    next();
    //res.send("Response 1!!");
}, (req,res,next) => {
    console.log("Handling route user 2");
    //res.send("Response 2!!");
    next();
}, (req,res,next) => {
    console.log("Handling route user 3");
    res.send("Response 3!!");
    //next();

});

app.listen(3000, () => {
    console.log('Server Running successfully');
});

