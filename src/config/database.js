const mongoose = require('mongoose');

//connect to cluster
const connectDb = async () => {
    await mongoose.connect("mongodb+srv://mriduljain202003:9093931909@cluster0.iynp6.mongodb.net/devX");
};

module.exports =  connectDb ;