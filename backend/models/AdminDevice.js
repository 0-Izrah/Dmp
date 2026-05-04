const mongoose = require("mongoose");

const adminDeviceSchema = new mongoose.Schema(
    {
        fingerprint: {
            type: String,
            required: true,
            unique: true,
        },
        label: {
            type: String,
            default: "Primary Device",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AdminDevice", adminDeviceSchema);