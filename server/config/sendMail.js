import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
 service:"gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email,subject, html) => {

  const mailOptions = {
    from: `"Shopswift" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: html,
  };


  await transporter.sendMail(mailOptions);
};
