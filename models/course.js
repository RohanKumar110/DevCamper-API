const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add a course title"]
    },
    description: {
        type: String,
        required: [true, "Please add a description"]
    },
    weeks: {
        type: String,
        required: [true, "Please add number of weeks"]
    },
    tuition: {
        type: Number,
        required: [true, "Please add a tuition cost"]
    },
    minimumSkill: {
        type: String,
        required: [true, "Please add a minimum skill"],
        enum: ["beginner", "intermediate", "advanced"]
    },
    scholarShipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: Schema.Types.ObjectId,
        ref: "Bootcamp",
        required: true
    }
});

// Static Method to getAverage of course tuitions
courseSchema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: "$bootcamp",
                averageCost: { $avg: "$tuition" }
            }
        }
    ]);
    try {
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        });
    } catch (err) {
        console.log(err);
    }
}

// Call getAverageCost after save
courseSchema.post("save", function (course) {
    course.constructor.getAverageCost(course.bootcamp);
});

// Call getAverageCost after remove
courseSchema.post("findOneAndDelete", function (course) {
    course.constructor.getAverageCost(course.bootcamp);
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;