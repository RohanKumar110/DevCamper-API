const express = require('express');
const router = express.Router({ mergeParams: true });
const courses = require("../controllers/courses");

router.route("/")
    .get(courses.getCourses)
    .post(courses.createCourse);

router.route("/:id")
    .get(courses.getCourse)
    .put(courses.updateCourse)
    .delete(courses.deleteCourse);

module.exports = router;