require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			service: process.env.MAIL_SERVICE,
			port: 587,
			secure: true,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASSWORD,
			},
		});

		await transporter.sendMail({
			from: process.env.MAIL_USER,
			to: email,
			subject: subject,
			text: text,
		});

		console.log("Email sent successfully");
	} catch (error) {
		console.log("Email not sent");
	}
};

module.exports = sendEmail;
