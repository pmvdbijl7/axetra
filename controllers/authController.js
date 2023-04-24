const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { validationResult } = require("express-validator");

const initializePassport = require("../config/passport");
initializePassport(passport);

// Get register page
const registerGet = (req, res) => {
	res.render("pages/auth/register", {
		title: "Sign Up",
		formData: null,
		errors: null,
	});
};

// Register user
const registerPost = async (req, res) => {
	try {
		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		// Create new user
		const user = new User({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email.toLowerCase(),
			password: hashedPassword,
		});

		// Save user
		user.save().then((user) => {
			// Redirect to register page
			res.redirect("/login");
		});
	} catch {
		// If something goes wrong -> Redirect to register page
		res.redirect("/signup");
	}
};

// Get login page
const loginGet = (req, res) => {
	res.render("pages/auth/login", {
		title: "Login",
		formData: null,
		errors: null,
	});
};

// Logout user
const logout = (req, res) => {
	// Logout authenticated user
	req.logout((err) => {
		if (err) {
			return next(err);
		}

		// Redirect to login page
		res.redirect("/login");
	});
};

module.exports = { registerGet, registerPost, loginGet, logout };
