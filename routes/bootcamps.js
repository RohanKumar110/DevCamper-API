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

module.exports = router;