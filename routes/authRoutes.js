const router = require("express").Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const accessController = require("../controllers/accessController");
const authValidation = require("../config/validation/authValidation");

// Register
router.get(
	"/signup",
	accessController.checkNotAuthenticated,
	authController.registerGet
);
router.post(
	"/signup",
	accessController.checkNotAuthenticated,
	authValidation.registerValidation,
	authController.registerPost
);

// Login
router.get(
	"/login",
	accessController.checkNotAuthenticated,
	authController.loginGet
);
router.post(
	"/login",
	accessController.checkNotAuthenticated,
	authValidation.loginValidation,
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
	})
);

// Logout
router.delete("/logout", authController.logout);

module.exports = router;
