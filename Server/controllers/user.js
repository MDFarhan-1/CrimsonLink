const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("../utils/createError")

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

const registerUser = async ( req,res)=>{
    try{
        const em=await User.findOne({email:req.body.email});
        if(em)
            return res.status(409).send({message:"User with given email already exists"})
        const salt = bcrypt.genSalt(10);
        const hash = bcrypt.hash(req.body.password,salt);
        const newUser = new User({
            ...req.body,
            password:hash,
        });
        await newUser.save();
        res.status(200).send({message:"User has been created"});
    
    }catch(err){
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc    Authenticate a user & get token
// @route   POST /api/users/login
// @access  Public

const loginUser = async (req,res,next)=>{
    try{
        const user=await User.findOne({email:req.body.email});

        if(!user){
            return next(createError(404,"User not found"));
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password,user.password);

        if(!isPasswordCorrect){
            return next(createError(401,"Wrong password or email!"));
        }

        const token=generateToken(user._id);

        res.status(200).json({
            message:"Login successful",
            token,
            userId:user._id,
        });
    }catch(err){
        res.status(500).json({message:'Server error', error: err.message});
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private

const getUserProfile = async (req,res)=>{
    try{
        const user = await User.findById(req.body._id);

        if(user){
            res.json(user);
        }else{
            res.status(404).json({message:'Unable to get the User'})
        }
    }catch(err){
        res.status(500).json({message:'Server error'})
    }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private

const updateUserProfile = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id);

        if(user){
            user.name = req.body.name || user.name;
            user.email = req.body.status || user.email;
            if(req.body.password){
                user.password = await bcrypt.hash(req.body.password,10);
            }
            user.profilePic = req.body.profilePic || user.profile.pic;
            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updateUser.name,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic,
                token:generateToken(updatedUser._id),
            })
        }else{
            res.status(404).json({message:'User not found'})
        }
    }catch(err){
        res.status(500).json({message:'Server error'})
    }
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private

const getUsers = async (req,res)=>{
    try{
        const currentUser = req.user._id;

        const users = await User.find({_id: {$ne:currentUserId}}).select('-password');
        res.json(users);
    }catch(err){
        res.status(500).json({message:'Server error'})
    }
}

const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d',
    });
};

const checkConnection = async (req,res)=>{
    const {fromUserId,toUserId} = req.params;

    try{
        const toUser = await User.findById(toUserId);

        if(toUser && toUser.connectedTo===fromUserId){
            res.status(200).json({connected:true});
        }else{
            res.status(200).json({connected:false});
        }
    }catch(err){
        res.status(500).json({message:"error while checking connection " ,error:err.message})
    }
};


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    checkConnection
}