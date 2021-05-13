const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
const { protectRoute } = require("../middlewares/auth");

router.post("/register", auth.register);

router.post("/login", auth.login);

router.get("/me", protectRoute, auth.getCurrentUser);

module.exports = router;