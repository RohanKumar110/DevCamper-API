const Review = require('../models/review');
const Bootcamp = require('../models/bootcamp');
const catchAsync = require("../utils/catchAsync");
const ExpressError = require('../utils/ExpressError');

// @desc        Get All Reviews
// @route       GET /api/v1/reviews
// @route       GET /api/v1/bootcamp/:bootcampId/reviews
// @access    PUBLIC    
module.exports.getReviews = catchAsync(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({ success: true, count: reviews.length, data: reviews });
    }
    else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc        Create new review
// @route        POST /api/v1/bootcamp/:bootcampId/reviews
// @access    PRIVATE
module.exports.createReview = catchAsync(async (req, res, next) => {
    const { bootcampId } = req.params;
    req.body.user = req.user.id;
    req.body.bootcamp = bootcampId;
    const foundBootcamp = await Bootcamp.findById(bootcampId);
    if (!foundBootcamp) {
        return next(new ExpressError(404, `Bootcamp not found with id of ${bootcampId}`));
    }
    const review = new Review(req.body);
    const newReview = await review.save();
    res.status(201).json({ success: true, data: newReview });
});

// @desc        Get Single Review
// @route       GET /api/v1/reviews/:id
// @access    PUBLIC    
module.exports.getReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id).populate({
        path: "bootcamp",
        select: "name description"
    });

    if (!review) {
        return next(new ExpressError(404, `Review not found with id of ${id}`));
    }
    res.status(200).json({ success: true, data: review });
});

// @desc        Update Single Review
// @route       PUT /api/v1/reviews/:id
// @access    PRIVATE    
module.exports.updateReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundReview = await Review.findById(id);

    if (!foundReview) {
        return next(new ExpressError(404, `Review not found with id of ${id}`));
    }
    // Make sure review belongs to user or user is Admin
    if (foundReview.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ExpressError(401, `Not authorized to update this review`));
    }
    const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true
    });
    updatedReview.save();
    res.status(200).json({ success: true, data: updatedReview });
});

// @desc        Delete Single Review
// @route       GET /api/v1/reviews/:id
// @access    PRIVATE
module.exports.deleteReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundReview = await Review.findById(id);

    if (!foundReview) {
        return next(new ExpressError(404, `Review not found with id of ${id}`));
    }
    // Make sure review belongs to user or user is Admin
    if (foundReview.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ExpressError(401, `Not authorized to update this review`));
    }
    await Review.findByIdAndDelete(id);
    res.status(200).json({ success: true, data: {} });
});