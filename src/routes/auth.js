const express = require('express');
const { validateSignUpData, validateSignInData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');



const authRouter = express.Router();


authRouter.post('/signup' , async (req,res) => {
    try{
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
            firstName,lastName,emailId,password: hashedPassword
        });

        await user.save();
        res.send("Welcome to DevX!! User successfully signed up");
    }
    catch(err){
        res.status(400).send(err.message);
    }
});


authRouter.post("/login", async (req,res) => {
    try{
        validateSignInData(req);
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if(!user){
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("User successfully logged in");
        }
        else{
            throw new Error("Invalid credentials");
        }
    }
    catch(err){
        res.status(400).send(err.message);
    }
});






module.exports = authRouter;