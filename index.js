if (process.env.NODE_ENV !== "production")
    require("dotenv").config();

const express = require("express");
const app = express();

// Route Files
const bootcamps = require("./routes/bootcamps");

// Restful Routes
app.use("/api/v1/bootcamps", bootcamps)

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));