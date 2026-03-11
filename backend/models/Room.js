const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
			minlength: 5,
			maxlength: 5,
		},
		name: {
			type: String,
			default: "My Dump",
		},

		ownerFingerprint: {
			type: String,
			required: true,
		},

		dumps: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Dump",
			},
		],

		photos: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Photo",
			},
		],
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Room", roomSchema);
