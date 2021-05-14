const express = require("express");
const bootcamps = require("../controllers/bootcamps");
const router = express.Router();
const Bootcamp = require("../models/bootcamp");
const advancedResults = require("../middlewares/advancedResults");
const { protectRoute, authorize } = require("../middlewares/auth");

// Include other resource routers
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

//Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/")
    .get(advancedResults(Bootcamp, "courses"), bootcamps.getBootcamps)
    .post(protectRoute, authorize("publisher", "admin"), bootcamps.createBootcamp);

router.route("/:id")
    .get(bootcamps.getBootcamp)
    .put(protectRoute, authorize("publisher", "admin"), bootcamps.updateBootcamp)
    .delete(protectRoute, authorize("publisher", "admin"), bootcamps.deleteBootcamp);

router.route("/:id/photo")
    .put(protectRoute, authorize("publisher", "admin"), bootcamps.uploadBootcampPhoto);

router.route("/radius/:zipcode/:distance")
    .get(bootcamps.getBootcampsInRadius);

module.exports = router;