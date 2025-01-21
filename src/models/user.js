
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type : String,
        required : true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        trim: true,
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
