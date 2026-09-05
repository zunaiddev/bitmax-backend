import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    failedLoginAttempts: {
        type: Number,
        default: 0,
        min: [0, "Failed login attempts cannot be negative"],
    },
    lockUntil: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

export default mongoose.model("User", userSchema);