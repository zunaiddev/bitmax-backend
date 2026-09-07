import OtpRepo from "../repository/OtpRepo.js";
import randomOtp from "../utils/generateOtp.js";
import bcrypt from "bcrypt";
import {HttpStatusCode} from "axios";
import CustomError from "../exception/CustomError.js";
import EmailService from "./EmailService.js";

class OtpService {
    async generateOtp(user, purpose) {
        const otp = await OtpRepo.findByUserAndPurpose(user, purpose);

        const generatedOtp = randomOtp();

        if (!otp) {
            await this.#saveNewOtp(user, generatedOtp, purpose);
            await EmailService.sendOtpEmail(user.email, generatedOtp, user.name);
            return generatedOtp;
        }
        2

        if (otp.lockUntil && otp.lockUntil < Date.now()) {
            throw new CustomError(HttpStatusCode.TooManyRequests, "Please try again after some time", "TOO_MANY_REQUESTS");
        }

        const allowedAt = new Date(otp.lastSentAt + 3 * 60 * 1000);

        if (allowedAt > Date.now()) {
            throw new CustomError(HttpStatusCode.TooEarly, "Please try again after some time", "TOO_EARLY", {
                allowedAt
            });
        }


        await otp.updateOne({
            otpHash: bcrypt.hashSync(generatedOtp, 10), otpNum: ++otp.otpNum,
            lockUntil: otp.otpNum >= 5 ? new Date(otp.lastSentAt + (10 * 60 * 1000)) : null
        });

        await EmailService.sendOtpEmail(user.email, generatedOtp, user.name);

        return generatedOtp;
    }

    async validateOtp(user, purpose, otp) {
        const fetchedOtp = await OtpRepo.findByUserAndPurpose(user, purpose);

        if (!fetchedOtp) {
            throw new CustomError(HttpStatusCode.NotFound, "Otp not found request a new one to validate", "OTP_NOT_FOUND");
        }

        if (fetchedOtp.expiresAt < Date.now()) {
            throw new CustomError(HttpStatusCode.Forbidden, "Otp has been expired request a new one to validate", "OTP_EXPIRED");
        }

        if (fetchedOtp.attempts >= 5) {
            throw new CustomError(HttpStatusCode.TooManyRequests, "You have reached max number of failed attempts", "MAX_FAILED_ATTEMPTS_REACHED");
        }

        if (!bcrypt.compareSync(otp, fetchedOtp.otpHash)) {
            await fetchedOtp.updateOne({attempts: ++fetchedOtp.attempts});
            throw new CustomError(HttpStatusCode.Unauthorized, "Invalid Otp", "INVALID_OTP");
        }

        await OtpRepo.deleteById(fetchedOtp._id);

        return true;
    }

    async #saveNewOtp(user, numberOtp, purpose, otpNum = 0) {
        return await OtpRepo.save({
            user, purpose,
            otpHash: bcrypt.hashSync(numberOtp, 10),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            lastSentAt: Date.now(),
            otpNum: otpNum + 1,
        });
    }
}

export default new OtpService();
