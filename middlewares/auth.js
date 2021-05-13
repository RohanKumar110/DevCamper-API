const jwt = require('jsonwebtoken');
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");

// Protect the routes
module.exports.protectRoute = catchAsync(async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1];
    }
    // Make sure token exists
    if (!token) {
        return next(new ExpressError(401, "Not authorize to access this"));
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        console.log(err);
        return next(new ExpressError(401, "Not authorize to access this"));
    }
});

// Grant acess to specific role
module.exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ExpressError(403, `User role ${req.user.role} is not authorized to access this route`)
            );
        }
        next();
    }
}