const nodemailer = require('nodemailer');
require('dotenv').config();
const asyncHandler = require("express-async-handler");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = asyncHandler ( async (to, subject, text) => {
    console.log(`Sending email to ${to}`);
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
        });
    console.log(`Email sent to ${to}`);
});

module.exports = sendEmail;
