const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		first_name: {
			type: String,
			maxLength: 50,
			required: true,
		},
		last_name: {
			type: String,
			maxLength: 50,
			required: true,
		},
		email: {
			type: String,
			maxLength: 255,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
