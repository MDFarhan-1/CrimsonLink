const mongoose = require("mongoose");
require('dotenv').config();

const mongoDB = async ()=>{
    try{
        const MONGO_URI = process.env.MONGO_URI;
        await mongoose.connect(process.env.MONGO_URI).then((data)=>{
            console.log(`mongodb connected with server: ${data.connection.host}`);
        })
    }catch(err){
        console.log('MongoDB connection error: ',err);
        process.exit(1);
    }
}

module.exports = mongoDB;