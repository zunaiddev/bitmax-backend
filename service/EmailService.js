import nodemailer from "nodemailer";

class EmailService {
    constructor() {
        this.isConfigured = Boolean(process.env.EMAIL_HOST);
        this.transport = this.isConfigured ? nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT || 587),
            secure: String(process.env.EMAIL_SECURE || "false") === "true",
            auth: process.env.EMAIL_USER && process.env.EMAIL_PASS ? {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            } : undefined,
        }) : null;
        this.from = process.env.EMAIL_FROM || process.env.EMAIL_USER || "no-reply@bitmax.local";
    }

    async sendOtpEmail(to, otp, name = "User") {
        if (!this.transport) {
            throw new Error("Email service is not configured. Set EMAIL_HOST and related SMTP variables.");
        }

        if (!to) {
            throw new Error("Recipient email is required");
        }

        if (!otp) {
            throw new Error("OTP is required");
        }

        const subject = "Verify your email";
        const text = `Hi ${name},\n\nYour verification OTP is ${otp}. It expires in 5 minutes.\n\nIf you did not request this, you can ignore this email.`;
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
                <h2 style="margin-bottom: 12px;">Verify your email</h2>
                <p>Hi ${name},</p>
                <p>Your verification OTP is:</p>
                <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; padding: 16px 20px; background: #f3f4f6; display: inline-block; border-radius: 8px;">${otp}</div>
                <p style="margin-top: 16px;">This OTP expires in 5 minutes.</p>
                <p>If you did not request this, you can ignore this email.</p>
            </div>
        `;

        await this.transport.sendMail({
            from: this.from,
            to,
            subject,
            text,
            html,
        });
    }

    async sendForgotPasswordEmail(name = "User", email, token) {
        if (!this.transport) {
            throw new Error("Email service is not configured. Set EMAIL_HOST and related SMTP variables.");
        }

        if (!email) {
            throw new Error("Recipient email is required");
        }

        if (!token) {
            throw new Error("Reset token is required");
        }

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
        const displayName = name || "User";
        const subject = "Reset your password";
        const text = `Hi ${displayName},\n\nYou requested to reset your password. Please use the following link to reset your password:\n${resetUrl}\n\nThis link expires in 30 minutes.\n\nIf you did not request a password reset, you can ignore this email.`;
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
                <h2 style="margin-bottom: 12px;">Reset your password</h2>
                <p>Hi ${displayName},</p>
                <p>You requested to reset your password. Click the button below to set a new password:</p>
                <div style="margin: 24px 0;">
                    <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Reset Password</a>
                </div>
                <p style="margin-top: 16px; font-size: 14px; color: #4b5563;">Or copy and paste this link into your browser:</p>
                <p style="font-size: 14px; word-break: break-all; color: #2563eb;">${resetUrl}</p>
                <p style="margin-top: 16px;">This link expires in 30 minutes.</p>
                <p>If you did not request a password reset, you can ignore this email.</p>
            </div>
        `;

        await this.transport.sendMail({
            from: this.from,
            to: email,
            subject,
            text,
            html,
        });
    }
}

export default new EmailService();
