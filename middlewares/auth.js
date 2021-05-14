const jwt = require('jsonwebtoken');
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");

// Protect the routes
module.exports.protectRoute = catchAsync(async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
        // Set token from Bearer Token in header
        token = authorization.split(" ")[1];
    } else if (req.cookies.token) {
        // Set token from cookie
        token = req.cookies.token;
    }
    // Make sure token exists
    if (!token) {
        return next(new ExpressError(401, "Not authorized to access this"));
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new ExpressError(401, "Not authorized to access this"));
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        return next(new ExpressError(401, "Not authorized to access this"));
    }
});

// Grant acess to specific role
module.exports.authorize = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return next(
                new ExpressError(401, `Not authorized to access this route`)
            );
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new ExpressError(403, `User role ${req.user.role} is not authorized to access this route`)
            );
        }
        next();
    }
}