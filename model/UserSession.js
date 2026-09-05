import mongoose from "mongoose";

const UserSession = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    accessToken: {
        type: String,
        required: true,
    },

    refreshToken: {
        type: String,
        required: true,
    },
    deviceIp: {
        type: String,
        required: true,
    },
    deviceType: {
        type: String,
        required: true,
    },
    deviceName: {
        type: String,
        required: true,
    }
});

export default mongoose.model('UserSession', UserSession);