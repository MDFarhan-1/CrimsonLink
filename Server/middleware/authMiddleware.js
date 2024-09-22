const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; 
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            req.user = await User.findById(decoded.id).select('-password'); 

            return next(); 
        } catch (err) {
            console.log('Token verification failed:', err); 
            return res.status(401).json({ message: "Not authorized, token failed" }); 
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };
