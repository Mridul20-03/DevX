const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    // Read the token from the request cookies
    const { token } = req.cookies;
    if(!token){
       throw new Error("Token not valid");  
    }
    const decodedData = await jwt.verify(token, "DevX@200$3");
    const { _id } = decodedData;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports =  { userAuth } ;
