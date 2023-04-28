const User = require("../models/User");
const Token = require("../models/Token");
const sendEmail = require("../config/nodemailer");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

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

// Get forgot password page
const forgotPasswordGet = (req, res) => {
	res.render("pages/auth/forgot_password", {
		title: "Forgot Password",
		formData: null,
		errors: null,
	});
};

// Send password reset email
const forgotPasswordPost = async (req, res) => {
	try {
		// Get filled in user
		const user = await User.findOne({
			email: req.body.email.toLowerCase(),
		});

		// Check if token exists -> if not, create new token
		const token = await Token.findOne({ userId: user._id });
		if (!token) {
			token = await new Token({
				userId: user._id,
				token: crypto.randomBytes(32).toString("hex"),
			}).save();
		}

		// Create password reset link and send email
		const link = `/forgot-password/${user._id}/${token.token}`;
		await sendEmail(user.email, "Forgot password", link);

		console.log("Success!");
		res.send("Password reset link has been sent to your email address.");
	} catch {
		// If something goes wrong -> Redirect to forgot password page
		res.redirect("/forgot-password");
	}
};

module.exports = {
	registerGet,
	registerPost,
	loginGet,
	logout,
	forgotPasswordGet,
	forgotPasswordPost,
};
