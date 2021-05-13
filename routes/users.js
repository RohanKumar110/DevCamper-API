const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const { protectRoute, authorize } = require("../middlewares/auth");
const User = require("../models/user");
const advancedResults = require("../middlewares/advancedResults");

router.use(protectRoute);
router.use(authorize("admin"));

router.route("/")
    .get(advancedResults(User), users.getUsers)
    .post(users.createUser);

router.route("/:id")
    .get(users.getUser)
    .put(users.updateUser)
    .delete(users.deleteUser);

module.exports = router;