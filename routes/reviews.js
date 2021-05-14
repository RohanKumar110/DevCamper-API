const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const Review = require("../models/review");
const { protectRoute, authorize } = require('../middlewares/auth');
const advancedResults = require('../middlewares/advancedResults');

router.route("/")
    .get(
        advancedResults(Review, {
            path: "bootcamp",
            select: "name description"
        }),
        reviews.getReviews)
    .post(protectRoute, authorize("user", "admin"), reviews.createReview);

router.route("/:id")
    .get(reviews.getReview)
    .put(protectRoute, authorize("user", "admin"), reviews.updateReview)
    .delete(protectRoute, authorize("user", "admin"), reviews.deleteReview);

module.exports = router;