const catchAsync = require("../utils/catchAsync");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/bootcamp");
const ExpressError = require("../utils/ExpressError");

// @desc        Get All bootcamps
// @route       GET /api/v1/bootcamps
// @access    PUBLIC    
module.exports.getBootcamps = catchAsync(async (req, res, next) => {

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt,$lt,etc) 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding query
    let query = Bootcamp.find(JSON.parse(queryStr));

    // Select FIELDS
    if (req.query.select) {
        const fields = req.query.select.replace(",", " ");
        query = query.select(fields);
    }

    //Sort 
    if (req.query.sort) {
        const sortBy = req.query.sort.replace(",", " ");
        query = query.sort(sortBy);
    } else {
        query = query.sort("-createdAt");
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const bootcamps = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
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

// @desc        Get Bootcamps within a radius
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    PRIVATE 
module.exports.getBootcampsInRadius = catchAsync(async (req, res, next) => {
    const { zipcode, distance } = req.params;
    // Get latitude and longitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //Calc radius using radians
    //Divide distance by radius of earth
    // Earth Radius is 3963 miles / 6378.1 km
    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200)
        .json({ sucess: true, count: bootcamps.length, data: bootcamps });
});
