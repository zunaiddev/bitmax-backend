import OtpRepo from "../repository/OtpRepo.js";
import randomOtp from "../utils/generateOtp.js";
import bcrypt from "bcrypt";
import {HttpStatusCode} from "axios";
import CustomError from "../exception/CustomError.js";

class OtpService {
    async generateOtp(user, purpose) {
        const otp = await OtpRepo.findByUserAndPurpose(user, purpose);

        const generatedOtp = randomOtp();

        if (!otp) {
            await this.#saveNewOtp(user, generatedOtp, purpose);
            return generatedOtp;
        }

        const allowedAt = new Date(otp.lastSentAt + 3 * 60 * 1000);

        if (allowedAt > Date.now()) {
            throw new CustomError(HttpStatusCode.TooEarly, "Please try again after some time", {
                allowedAt
            });
        }

        await OtpRepo.deleteById(otp._id);

        await this.#saveNewOtp(user, generatedOtp, purpose);

        return generatedOtp;
    }

    async validateOtp(user, purpose, otp) {
        const fetchedOtp = await OtpRepo.findByUserAndPurpose(user, purpose);

        if (!fetchedOtp) {
            throw new CustomError(HttpStatusCode.NotFound, "Otp not found request a new one to validate");
        }

        if (fetchedOtp.expiresAt < Date.now()) {
            throw new CustomError(HttpStatusCode.Forbidden, "Otp has been expired request a new one to validate");
        }

        if (fetchedOtp.attempts >= 5) {
            throw new CustomError(HttpStatusCode.TooManyRequests, "You have reached max number of failed attempts")
        }

        if (!bcrypt.compareSync(otp, fetchedOtp.otpHash)) {
            await fetchedOtp.updateOne({attempts: ++fetchedOtp.attempts});
            throw new CustomError(HttpStatusCode.Unauthorized, "Invalid Otp");
        }

        await OtpRepo.deleteById(fetchedOtp._id);

        return true;
    }

    async #saveNewOtp(user, numberOtp, purpose) {
        return await OtpRepo.save({
            user, purpose,
            otpHash: bcrypt.hashSync(numberOtp, 10),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            lastSentAt: Date.now(),
        });
    }
}

export default new OtpService();
