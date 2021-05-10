const express = require('express');
const router = express.Router({ mergeParams: true });
const courses = require("../controllers/courses");
const Course = require("../models/course");
const advancedResults = require("../middlewares/advancedResults");

router.route("/")
    .get(
        advancedResults(Course, {
            path: "bootcamp",
            select: "name description"
        }),
        courses.getCourses)
    .post(courses.createCourse);

router.route("/:id")
    .get(courses.getCourse)
    .put(courses.updateCourse)
    .delete(courses.deleteCourse);

module.exports = router;