const ExpressError = require("../utils/ExpressError");

const errorHandler = (err, req, res, next) => {

    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const msg = `Resource not found`;
        error = new ExpressError(404, msg);
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const msg = `Duplicate field value`;
        error = new ExpressError(400, msg);
    }
    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(err => err.message);
        error = new ExpressError(400, message);
    }


    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error"
    });
}

module.exports = errorHandler;