const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcrypt");

function initialize(passport) {
	passport.use(
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
			},
			(email, password, done) => {
				// Lowercase filled in email
				const emailLowercase = email.toLowerCase();

				User.findOne({ email: emailLowercase }, async (err, user) => {
					if (err) {
						return done(err);
					}

					// Check if user exists
					if (!user) {
						return done();
					}

					// Check if password is correct
					const validPass = await bcrypt.compare(
						password,
						user.password
					);
					if (!validPass) {
						return done();
					}

					return done(null, user);
				});
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
}

module.exports = initialize;
