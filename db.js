const mongoose = require("mongoose");

const connectDB = () => {
    const dbUrl = process.env.DB_URL;
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "Connection error!!!".red));
    db.once("open", () => {
        console.log("Database connected".yellow.bold);
    });
}

module.exports = connectDB;