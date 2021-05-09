const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const Course = require("../models/course");

// @desc        Get courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/:bootcampId/courses
// @access    PUBLIC
module.exports.getCourses = catchAsync(async (req, res, next) => {
    let query;

    if (req.params.bootcampId)
        query = Course.find({ bootcamp: req.params.bootcampId })
            .populate({
                path: "bootcamp",
                select: "name description"
            });
    else
        query = Course.find({});

    const courses = await query;
    res.status(200).json({ success: true, count: courses.length, data: courses });
});

