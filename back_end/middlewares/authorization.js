const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authorization = (roles) => async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(400).json({ status: false, message: 'Token required' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECURE_KEY);
        const user = await User.findOne({ _id: decodedToken._id }).populate('role');

        if (!roles?.includes(user.role.role)) {
            return res.status(401).json({ status: false, message: 'Unauthorized User' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

module.exports = authorization;
