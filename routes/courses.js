const express = require('express');
const router = express.Router({ mergeParams: true });
const courses = require("../controllers/courses");

router.route("/")
    .get(courses.getCourses);

module.exports = router;