const mongoose = require('mongoose');
const validator = require('validator');


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


const User = mongoose.model("User",userSchema);

module.exports = User ;
