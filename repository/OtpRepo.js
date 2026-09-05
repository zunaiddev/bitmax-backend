import Otp from "../model/Otp.js";

class OtpRepo {
    #resolveUserId(userOrId) {
        if (!userOrId) {
            throw new Error("User is required");
        }

        return userOrId._id ? userOrId._id : userOrId;
    }

    async save(data) {
        if (!data) {
            throw new Error("Otp data is required");
        }

        return await Otp.create(data);
    }

    async findByUser(userOrId) {
        const user = this.#resolveUserId(userOrId);

        return await Otp.find({user});
    }

    async findActiveByUser(userOrId) {
        const user = this.#resolveUserId(userOrId);

        return await Otp.findOne({user, isActive: true});
    }

    async findByUserAndPurpose(userOrId, purpose) {
        if (!purpose) {
            throw new Error("OTP purpose is required");
        }

        const user = this.#resolveUserId(userOrId);

        return await Otp.findOne({user, purpose});
    }

    async deleteByUser(userOrId) {
        const user = this.#resolveUserId(userOrId);

        return await Otp.deleteMany({user});
    }

    async deleteById(id) {
        if (!id) {
            throw new Error("Otp ID is required");
        }

        return await Otp.deleteOne({_id: id});
    }
}

export default new OtpRepo();
