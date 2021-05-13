const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const Course = require("../models/course");
const Bootcamp = require("../models/bootcamp");

// @desc        Get courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/:bootcampId/courses
// @access    PUBLIC
module.exports.getCourses = catchAsync(async (req, res, next) => {

    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({ success: true, count: courses.length, data: courses });
    }
    else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc        Create New course
// @route       POST /api/v1/bootcamps/:bootcampId/courses
// @access    PRIVATE
module.exports.createCourse = catchAsync(async (req, res, next) => {
    const { bootcampId } = req.params;
    req.body.bootcamp = bootcampId;
    req.body.user = req.user.id;
    const foundBootcamp = await Bootcamp.findById(bootcampId);
    if (!foundBootcamp) {
        return next(new ExpressError(404, `Bootcamp not found with id of ${bootcampId}`));
    }

    // Make sure user is bootcamp owner and  also not an admin
    if (foundBootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(
            new ExpressError(
                401,
                `User ${req.user.id} not authorized to add a course to this bootcamp ${bootcampId}`
            )
        );
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

// @desc        Update Single course
// @route       PUT /api/v1/courses/:id
// @access    PRIVATE
module.exports.updateCourse = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundCourse = await Course.findById(id);

    if (!foundCourse) {
        return next(new ExpressError(404, `Course not found with id of ${id}`));
    }
    // Make sure user is bootcamp owner and  also not an admin
    if (foundCourse.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(
            new ExpressError(
                401,
                `User ${req.user.id} not authorized to update a course to this bootcamp ${id}`
            )
        );
    }
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true
    });
    res.status(200).json({ success: true, data: updatedCourse });
});

// @desc        Delete SIngle course
// @route       POST /api/v1/courses/:id
// @access    PRIVATE
module.exports.deleteCourse = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundCourse = await Course.findById(id);
    if (!foundCourse) {
        return next(new ExpressError(404, `Course not found with id of ${id}`));
    }
    // Make sure user is bootcamp owner and  also not an admin
    if (foundCourse.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(
            new ExpressError(
                401,
                `User ${req.user.id} not authorized to delete a course to this bootcamp ${id}`
            )
        );
    }
    await Course.findByIdAndDelete(id);
    res.status(200).json({ success: true, data: {} });
});

