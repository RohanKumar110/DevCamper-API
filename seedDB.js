require('dotenv').config();
require('colors');
const fs = require('fs');
const mongoose = require('mongoose');


// Load Models
const Bootcamp = require('./models/bootcamp');
const Course = require('./models/course');
const User = require('./models/user');
const Review = require('./models/review');

//Connect to DB
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8"));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8"));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8"));

// Import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        await Review.create(reviews);
        console.log("Data Imported".green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

// Import into DB
const deleteData = async () => {
    try {
        await Course.deleteMany({});
        await Bootcamp.deleteMany({});
        await Review.deleteMany({});
        await User.deleteMany({});
        console.log("Data Destroyed".red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

console.log("Processing...");
if (process.argv[2] === "-i") {
    importData();
}
else if (process.argv[2] === "-d") {
    deleteData();
} else {
    console.log("Please Specify Option");
    process.exit();
}