const express = require("express");
const bootcamps = require("../controllers/bootcamps");
const router = express.Router();

// Include other resource routers
const courseRouter = require("./courses");

//Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/")
    .get(bootcamps.getBootcamps)
    .post(bootcamps.createBootcamp);

router.route("/:id")
    .get(bootcamps.getBootcamp)
    .put(bootcamps.updateBootcamp)
    .delete(bootcamps.deleteBootcamp);

router.route("/:id/photo")
    .put(bootcamps.uploadBootcampPhoto);

router.route("/radius/:zipcode/:distance")
    .get(bootcamps.getBootcampsInRadius);

module.exports = router;