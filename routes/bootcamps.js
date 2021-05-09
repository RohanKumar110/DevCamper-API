const express = require("express");
const bootcamps = require("../controllers/bootcamps");
const router = express.Router();

router.route("/")
    .get(bootcamps.getBootcamps)
    .post(bootcamps.createBootcamp);

router.route("/:id")
    .get(bootcamps.getBootcamp)
    .put(bootcamps.updateBootcamp)
    .delete(bootcamps.deleteBootcamp);

router.route("/radius/:zipcode/:distance")
    .get(bootcamps.getBootcampsInRadius);

module.exports = router;