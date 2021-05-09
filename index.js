require("colors");
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./db");
const errorHandler = require("./middlewares/error");
const app = express();

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
    // Dev Logging Middleware
    app.use(morgan("dev"));
}

// Connect to Mongo Database
connectDB();

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route Files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

// Restful Routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
//Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT,
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));