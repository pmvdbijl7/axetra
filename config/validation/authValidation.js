const { body, validationResult } = require("express-validator");
const User = require("../../models/User");
const bcrypt = require("bcrypt");

// Register form
const registerValidation = [
	body("first_name")
		.notEmpty()
		.withMessage("First name is required")
		.bail()
		.isLength({ max: 50 })
		.withMessage("First name cannot contain more than 50 characters")
		.bail(),
	body("last_name")
		.notEmpty()
		.withMessage("Last name is required")
		.bail()
		.isLength({ max: 50 })
		.withMessage("Last name cannot contain more than 50 characters")
		.bail(),
	body("email")
		.notEmpty()
		.withMessage("Email address is required")
		.bail()
		.isEmail()
		.withMessage("This is not a valid email address")
		.bail()
		.isLength({ max: 255 })
		.withMessage("Email address cannot contain more than 255 characters")
		.bail()
		.custom((value, { req }) => {
			return new Promise((resolve, reject) => {
				// Lowercase filled in email address
				const email = req.body.email.toLowerCase();

				User.findOne({ email: email }, (err, user) => {
					if (err) {
						return reject(new Error("Server error"));
					}

					if (Boolean(user)) {
						return reject(
							new Error("This email address already exist")
						);
					}

					resolve(true);
				});
			});
		}),
	body("password")
		.notEmpty()
		.withMessage("Password is required")
		.bail()
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters long")
		.bail(),
	body("password_confirm")
		.notEmpty()
		.withMessage("Confirm password is required")
		.bail()
		.custom((value, { req }) => value === req.body.password)
		.withMessage("Passwords do not match"),
	(req, res, next) => {
		const formData = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
		};
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render("pages/auth/register", {
				title: "Sign Up",
				formData: formData,
				errors: errors.array(),
			});
		} else next();
	},
];

// Validation for the login form
const loginValidation = [
	body("email")
		.notEmpty()
		.withMessage("Email address is required")
		.bail()
		.isEmail()
		.withMessage("This is not a valid email address")
		.bail()
		.custom((value, { req }) => {
			return new Promise((resolve, reject) => {
				// Lowercase filled in email address
				const email = req.body.email.toLowerCase();

				// Check if email address exists
				User.findOne({ email: email }, (err, user) => {
					if (err) {
						return reject(new Error("Server error"));
					}

					if (!Boolean(user)) {
						return reject(
							new Error("This email address does not exist")
						);
					}

					return resolve(true);
				});
			});
		}),
	body("password")
		.notEmpty()
		.withMessage("Password is required")
		.bail()
		.custom((value, { req }) => {
			return new Promise((resolve, reject) => {
				// Lowercase filled in email address
				const email = req.body.email.toLowerCase();

				// Check if password is correct
				User.findOne({ email: email }, async (err, user) => {
					if (err) {
						return reject(new Error("Server error"));
					}

					// Check if email address was correct
					if (!user) {
						return resolve(true);
					}

					// If email address is correct -> check if password is correct
					const validPass = await bcrypt.compare(
						req.body.password,
						user.password
					);
					if (!validPass) {
						return reject(new Error("Wrong password"));
					}

					return resolve(true);
				});
			});
		}),
	(req, res, next) => {
		const formData = {
			email: req.body.email,
		};
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render("pages/auth/login", {
				title: "Login",
				formData: formData,
				errors: errors.array(),
			});
		} else next();
	},
];

module.exports = { registerValidation, loginValidation };
