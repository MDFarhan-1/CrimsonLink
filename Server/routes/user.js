const express = require("express");
const router = express.Router();
const {registerUser, loginUser, getUserProfile, updateUserProfile, getUsers, checkConnection} = require("../controllers/user")
const  {protect} =require("../middleware/authMiddleware")


router.post('/register',registerUser);
router.post('/login',loginUser);
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile)
router.route('/explore').get(protect,getUsers);
router.route('/check-connection/:fromUserId/:toUserId').get(protect,checkConnection)

module.exports = router;