const catchAsync = require("../utils/catchAsync");
const Bootcamp = require("../models/bootcamp");
const ExpressError = require("../utils/ExpressError");

// @desc        Get All bootcamps
// @route       GET /api/v1/bootcamps
// @access    PUBLIC   
module.exports.getBootcamps = catchAsync(async (req, res, next) => {
    const bootcamps = await Bootcamp.find({});
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc        Create new bootcamp
// @route       POST /api/v1/bootcamps
// @access    PRIVATE
module.exports.createBootcamp = catchAsync(async (req, res, next) => {
    const bootcamp = new Bootcamp(req.body);
    const newBootcamp = await bootcamp.save();
    res.status(201).json({ success: true, data: newBootcamp });
});

// @desc        Get Single bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access    PUBLIC   
module.exports.getBootcamp = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findById(id);
    if (!bootcamp) {
        return next(new ExpressError(404, `Bootcamp not found with id of ${id}`));
    }
    res.status(200).json({ success: true, data: bootcamp });
});

// @desc        Update Single bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access    PRIVATE
module.exports.updateBootcamp = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });
    if (!updatedBootcamp) {
        return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: updatedBootcamp });
});

// @desc        Delete Single bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access    PRIVATE 
module.exports.deleteBootcamp = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedBootcamp = await Bootcamp.findByIdAndDelete(id);
    if (!deletedBootcamp) {
        return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
});
