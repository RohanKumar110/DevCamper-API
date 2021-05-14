const mongoose = require('mongoose');
const Bootcamp = require("./bootcamp");
const { Schema } = mongoose;

const reviewSchema = new Schema({
    title: {
        type: String,
        trim: true,
        maxlength: 250,
        required: [true, "Please add  a title for the review"]
    },
    text: {
        type: String,
        required: [true, "Please add some text for the review"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, "Please add a rating between 1 and 10"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: Schema.Types.ObjectId,
        ref: "Bootcamp",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

// Static method to get avg of review rating
reviewSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: "$bootcamp",
                averageRating: { $avg: "$rating" }
            }
        }
    ]);
    try {
        if (obj[0]) {
            await Bootcamp.findByIdAndUpdate(bootcampId, {
                averageRating: obj[0].averageRating
            });
        } else {
            await Bootcamp.findByIdAndUpdate(bootcampId, {
                averageRating: undefined
            });
        }
    } catch (err) {
        console.log(err);
    }
}

// Call getAverageRating after save
reviewSchema.post("save", async function (review) {
    review.constructor.getAverageRating(review.bootcamp);
});

// Call getAverageRating after delete
reviewSchema.post("findOneAndDelete", function (review) {
    review.constructor.getAverageRating(review.bootcamp);
});

// Prevent user from submitting more than one review per bootcamp
reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;