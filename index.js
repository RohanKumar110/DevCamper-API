require("colors");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./db");
const errorHandler = require("./middlewares/error");
const fileupload = require("express-fileupload");
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');
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

//Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set Security headers
app.use(helmet());

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100
});

app.use(apiLimiter);

// Prevent http param pollution
app.use(hpp());

// Prevent Cross site scripting
// Make sure this comes before any routes
app.use(xss());

// Enable cors
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Route Files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const reviews = require("./routes/reviews");
const users = require("./routes/users");
const auth = require("./routes/auth");

// File uploading
app.use(fileupload());

// Mount Routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/users", users);
app.use("/api/v1/auth", auth);

//Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT,
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));