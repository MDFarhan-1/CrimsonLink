const mongoose=require("mongoose");
require('dotenv').config();
const mongoDB=async()=>{
    try{
        // console.log(process.env.MONGODB_URI)
        const MONGO_URI=process.env.MONGODB_URI;
        // await mongoose.connect(MONGO_URI)
        await mongoose.connect(process.env.MONGODB_URI,{
            ssl:true
        }).then((data)=>{
            console.log(`mongodb connected with server: ${data.connection.host}`);
        })
        // console.log("Connected to MONGO DB")
    }catch(err){
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

module.exports=mongoDB;