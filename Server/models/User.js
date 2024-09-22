const mongoose =require("mongoose");

const UserSchema= new mongoose.Schema({
    username:{
        type:String,required:true,unique:true
    },
    email:{
        type:String,required,unique:true
    },
    password:{
        type:String,required:true
    },
    profilePicture:{
        type:String
    },
    friends:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    socketId:{
        type:String
    },
    connectedTo:{
        type:String
    }
})