import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
