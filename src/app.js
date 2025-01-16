const express = require('express');
//create an express js application
const app = express();

const port = 3000;

app.use("/test",(req,res) => {
    res.send("Welcome to tester of DevX");
});
app.use((req,res) => {
    res.send("Welcome to DevX");
});

app.listen(3000, () => {
    console.log('Server Running successfully');
});

