// @desc        Get All bootcamps
// @route       GET /api/v1/bootcamps
// @access    PUBLIC   
module.exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: "Show all Bootcamps" });
}

// @desc        Create new bootcamp
// @route       POST /api/v1/bootcamps
// @access    PRIVATE
module.exports.createBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: "Create new Bootcamp" });
}

// @desc        Get Single bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access    PUBLIC   
module.exports.getBootcamp = (req, res, next) => {
    const { id } = req.params;
    res.status(200).json({ success: true, msg: `Show Bootcamp ${id}` });
}

// @desc        Update Single bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access    PRIVATE
module.exports.updateBootcamp = (req, res, next) => {
    const { id } = req.params;
    res.status(200).json({ success: true, msg: `Update Bootcamp ${id}` });
}

// @desc        Delete Single bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access    PRIVATE 
module.exports.deleteBootcamp = (req, res, next) => {
    const { id } = req.params;
    res.status(200).json({ success: true, msg: `Delete Bootcamp ${id}` });
}
