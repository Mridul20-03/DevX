const express = require('express');
const { userAuth } = require('../middlewares/auth.js'); 


const profileRouter = express.Router();

profileRouter.get('/profile', userAuth , async(req, res, next) => {
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send(err.message);
    }
});





module.exports = profileRouter;