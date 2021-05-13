const express = require('express');
const router = express.Router({ mergeParams: true });
const courses = require("../controllers/courses");
const Course = require("../models/course");
const advancedResults = require("../middlewares/advancedResults");
const { protectRoute, authorize } = require("../middlewares/auth");

router.route("/")
    .get(
        advancedResults(Course, {
            path: "bootcamp",
            select: "name description"
        }),
        courses.getCourses)
    .post(protectRoute, authorize("publisher", "admin"), courses.createCourse);

router.route("/:id")
    .get(courses.getCourse)
    .put(protectRoute, authorize("publisher", "admin"), courses.updateCourse)
    .delete(protectRoute, authorize("publisher", "admin"), courses.deleteCourse);

module.exports = router;