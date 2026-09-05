import mongoose from "mongoose";

const Schema = mongoose.Schema;

const otpSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true,
    },
    otpHash: {
        type: String,
        required: [true, "OTP hash is required"],
    },
    purpose: {
        type: String,
        required: [true, "OTP purpose is required"],
        enum: ["VERIFY_EMAIL", "VERIFY_PHONE", "RESET_PASSWORD", "LOGIN"],
        trim: true,
    },
    expiresAt: {
        type: Date,
        required: [true, "OTP expiry is required"],
        index: true,
    },
    lastSentAt: {
        type: Date,
        default: null,
    },
    otpNum: {
        type: Number,
        default: 0,
    },
    attempts: {
        type: Number,
        default: 0,
        min: [0, "OTP attempts cannot be negative"],
    },
    lockUntil: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

// otpSchema.index({user: 1, purpose: 1, isActive: 1});
// otpSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});

export default mongoose.model("Otp", otpSchema);
