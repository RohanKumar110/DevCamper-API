const User = require('../models/user');
const catchAsync = require("../utils/catchAsync");
const ExpressError = require('../utils/ExpressError');

// @desc        Get All users
// @route       GET /api/v1/users
// @access    PRIVATE/Admin
module.exports.getUsers = catchAsync(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc        Create new user
// @route       POST /api/v1/users
// @access    PRIVATE/Admin
module.exports.createUser = catchAsync(async (req, res, next) => {
    const user = new User(req.body);
    const newUser = await user.save();
    res.status(201).json({ success: true, data: newUser });
});

// @desc        Get Single user
// @route       GET /api/v1/users/:id
// @access    PRIVATE/Admin
module.exports.getUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return next(new ExpressError(404, `User not found with id of ${id}`));
    }
    res.status(200).json({ success: true, data: user });
});

// @desc        Update single user
// @route       PUT /api/v1/users/:id
// @access    PRIVATE/Admin
module.exports.updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true
    });
    if (!updatedUser) {
        return next(new ExpressError(404, `User not found with id of ${id}`));
    }
    res.status(200).json({ success: true, data: updatedUser });
});

// @desc        Delete single user
// @route       DELETE /api/v1/users/:id
// @access    PRIVATE/Admin
module.exports.deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
        return next(new ExpressError(404, `User not found with id of ${id}`));
    }
    res.status(200).json({ success: true, data: {} });
});