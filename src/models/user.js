const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    firstName: {
        type : String,
        required : true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    emailId: {
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: " + value);
            }
        },
    },
    password: {
        type: String,
        required : true,
    },
    age: {
        type: Number,
        min: 16,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female"].includes(value)){
                throw new Error('Gender data is not valid');
            }
        },
    },
    photoUrl : {
        type: String,
        default : "https://www.phoenixi.co.jp/wp-content/uploads/2018/05/dummy-user-1000x1000.png",
        
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Url is not valid: ' + value);
            }
        }
    },
    about: {
        type: String,
        default: " This is the default description about the user",
    },
    skills: {
        type: [String],
        validate(value) {
            if(value.length > 20){
                throw new Error('There cannot be more than 20 skills');
            }
        }
    }
},{timestamps : true});



userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: this._id }, "DevX@200$3",
            { expiresIn : "7d" });

        return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
         
};



const User = mongoose.model("User",userSchema);

module.exports = User ;
