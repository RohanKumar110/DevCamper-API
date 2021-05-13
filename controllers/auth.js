const User = require('../models/user');
const catchAsync = require("../utils/catchAsync");
const ExpressError = require('../utils/ExpressError');

// @desc        Register User
// @route       POST /api/v1/auth/register
// @access    PUBLIC
module.exports.register = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    //Create User
    const user = new User({ name, email, password, role });
    const newUser = await user.save();

    sendTokenResponse(res, 200, newUser);
});

// @desc        Login User
// @route       POST /api/v1/auth/login
// @access    PUBLIC
module.exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // Validate email and password
    if (!email || !password) {
        return next(new ExpressError(400, "Please provide email and password"));
    }
    //Check for  user
    const user = await User.findOne({ email }).select("+password");
    // Check if user exists
    if (!user) {
        return next(new ExpressError(401, "Invalid credentials"));
    }
    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ExpressError(401, "Invalid credentials"));
    }
    sendTokenResponse(res, 200, user);
});

// @desc        Get current logged In User
// @route       POST /api/v1/auth/me
// @access    PRIVATE
module.exports.getCurrentUser = catchAsync(async (req, res, next) => {
    user = await User.findById(req.user.id);
    res.status(200).json({ sucess: true, data: user });
});

//Get token from model and also create cookie and send response
const sendTokenResponse = (res, statusCode, user) => {
    // JWT token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === "production") {
        options[secure] = true;
    }
    res
        .status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true, token
        });
}