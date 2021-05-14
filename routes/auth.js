const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const { protectRoute } = require("../middlewares/auth");

router.post("/register", auth.register);

router.post("/login", auth.login);

router.get("/logout", protectRoute, auth.logout);

router.get("/me", protectRoute, auth.getCurrentUser);

router.get("/forgotpassword", auth.forgotPassword);

router.put("/resetpassword/:resetToken", auth.resetPassword);

router.put("/updatedetails", protectRoute, auth.updateDetails);

router.put("/updatepassword", protectRoute, auth.updatePassword);

module.exports = router;