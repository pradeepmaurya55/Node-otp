const nodemailer = require("nodemailer");
const UserModel = require("../models/UserModel");

require("dotenv").config();

const send_otp = async (email) => {
  let max = 999999;

  const otp = Math.floor(Math.random() * max);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Account Login/Register email",
    text: `Your OTP is ${otp}`,
  });

  const user = await UserModel.findOne({ email: email });
  user.otp = otp;
  user.otp_created = Date.now();
  await user.save();
  return info;
};

module.exports = { send_otp };
