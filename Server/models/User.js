const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({

    username:{
        type:String,required:true,unique:true
    },
    email:{
        type:String,required:true,unique:true
    },
    password:{
        type:String,required:true
    },
    profilePicture:{
        type:String
    },
    friends:[{type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    socketId:{
        type:String
    },
    connectedTo: {
        type:String
    }


},{timestamps:true});

const User=mongoose.model('User',UserSchema);
module.exports=User;