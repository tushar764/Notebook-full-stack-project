const mongoose = require('mongoose')
const mongoURI = "mongodb://127.0.0.1:27017/notebook1"; // Replace 'notebook' with your database name



const connectToMongo =()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to Mongo Successfully")
    })
}

module.exports = connectToMongo