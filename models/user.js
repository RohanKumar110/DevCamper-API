const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: "user"
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 8,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Sign JWT and return it
userSchema.methods.getSignedJwtToken = function () {
    const options = { expiresIn: process.env.JWT_EXPIRE };
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, options);
}

// Match user entered password to hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    //Hash token and set to resetPasswordToken Field
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    // Set resetPasswordExpire Field
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model("User", userSchema);

module.exports = User;