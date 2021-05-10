const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const Course = require("../models/course");
const Bootcamp = require("../models/bootcamp");

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

// @desc        Create New course
// @route       POST /api/v1/bootcamps/:bootcampId/courses
// @access    PRIVATE
module.exports.createCourse = catchAsync(async (req, res, next) => {
    const { bootcampId } = req.params;
    req.body.bootcamp = bootcampId;
    const bootcamp = await Bootcamp.findById(bootcampId);
    if (!bootcamp) {
        return next(new ExpressError(404, `Bootcamp not found with id of ${id}`));
    }
    const course = new Course(req.body);
    const newCourse = await course.save();

    res.status(200).json({ success: true, data: newCourse });
});

// @desc        Get Single course
// @route       GET /api/v1/courses/:id
// @access    PUBLIC
module.exports.getCourse = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const course = await Course.findById(id).populate({ path: "bootcamp", select: "name description" });
    if (!course) {
        return next(new ExpressError(404, `Course not found with id of ${id}`));
    }
    res.status(200).json({ success: true, data: course });
});

// @desc        Create Single course
// @route       PUT /api/v1/courses/:id
// @access    PRIVATE
module.exports.updateCourse = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updatedCourse) {
        return next(new ExpressError(404, `Course not found with id of ${id}`));
    }
    res.status(200).json({ success: true, data: updatedCourse });
});

// @desc        Deete SIngle course
// @route       POST /api/v1/courses/:id
// @access    PRIVATE
module.exports.deleteCourse = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
        return next(new ExpressError(404, `Course not found with id of ${id}`));
    }
    res.status(200).json({ success: true, data: {} });
});

