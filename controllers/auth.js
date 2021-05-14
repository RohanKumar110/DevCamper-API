const crypto = require('crypto');
const User = require('../models/user');
const catchAsync = require("../utils/catchAsync");
const ExpressError = require('../utils/ExpressError');
const sendEmail = require("../utils/sendEmail");

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

// @desc        Log user out / clear cookie
// @route       GET /api/v1/auth/logout
// @access    PRIVATE
module.exports.logout = catchAsync(async (req, res, next) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 10000),
        httoOnly: true
    });
    res.status(200).json({ sucess: true, data: {} });
});

// @desc        Get current logged In User
// @route       POST /api/v1/auth/me
// @access    PRIVATE
module.exports.getCurrentUser = catchAsync(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({ sucess: true, data: user });
});

// @desc        Forgot Password
// @route       POST /api/v1/auth/forgotpassword
// @access    PUBLIC
module.exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ExpressError(404, `User not found with that email`));
    }
    // Get resetToken
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to \n\n${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Token",
            message
        })
        res.status(200).json({ success: true, data: `Email Sent` });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ExpressError(500, "Email could not be sent"));
    }
});

// @desc        Reset password
// @route       PUT /api/v1/auth/resetpassword/:resetToken
// @access    PUBLIC
module.exports.resetPassword = catchAsync(async (req, res, next) => {
    const { resetToken } = req.params;
    // Get Hashed Token
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(
            new ExpressError(400, "Invalid Token")
        );
    }
    //Set new Password 
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendTokenResponse(res, 200, user);
});

// @desc        Update User details
// @route       PUT /api/v1/auth/updateDetails
// @access    PRIVATE
module.exports.updateDetails = catchAsync(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    };
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        runValidators: true,
        new: true
    });
    res.status(200).json({ sucess: true, data: user });
});

// @desc        Update logged in user password
// @route       PUT /api/v1/auth/updatepassword
// @access    PRIVATE
module.exports.updatePassword = catchAsync(async (req, res, next) => {

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    //Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
        return next(new ExpressError(401, "Password Incorrect"));
    }
    user.password = newPassword;
    await user.save();
    sendTokenResponse(res, 200, user);
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