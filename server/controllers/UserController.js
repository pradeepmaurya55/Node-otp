const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const { send_otp } = require("../controllers/Email.js");
require("dotenv").config();

const generateOTP = async (req, res) => {
  const data = req.body;

  if (!data || !data?.email) res.status(400).send("Email required");
  let user = await UserModel.findOne({ email: data?.email });
  if (!user) {
    UserModel.create(data);
  }

  user = await UserModel.findOne({ email: data?.email });

  let current = new Date();
  current.setTime(Date.now());

  if (user?.login_restricted) {
    if (current.getTime() < user.login_restricted.getTime())
      return res.status(400).send("Login Restricted for 1 hour");
  }

  if (user?.otp_created) {
    if (current.getTime() < user.otp_created.getTime() + 60000)
      return res
        .status(400)
        .send("Wait one minute to make another OTP request");
  }

  let info = await send_otp(data.email);
  console.log(info.messageId);
  return res.status(200).send("OTP sent on mail");
};

const verifyOTP = async (req, res) => {
  const data = req.body;

  if (!data || !data.email || !data.otp)
    return res.status(400).send("Email or OTP missing");

  const user = await UserModel.findOne({ email: data?.email });
  if (!user) return res.status(400).send("No such email found");

  let current = new Date();
  current.setTime(Date.now());

  if (user.login_restricted) {
    if (current.getTime() < user.login_restricted.getTime())
      return res.status(400).send("Login Restricted for 1 hour");
  }

  if (data.otp !== user.otp) {
    user.otp_fails = user.otp_fails + 1;
    await user.save();

    if (user.otp_fails >= 5) {
      user.login_restricted = Date.now();
      user.login_restricted.setMinutes(user.login_restricted.getMinutes() + 60);
      user.otp_fails = 0;
      user.save();
      return res.status(400).send("Login Restricted for 1 hour");
    }
    return res.status(400).send("OTP mismatch");
  }

  if (current.getTime() - 5 * 60000 > user.otp_created.getTime())
    return res.status(400).send("OTP Timeout");

  //get token
  user.otp_fails = 0;
  user.otp = 0.1234;
  await user.save();
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "120m",
  });
  return res.status(200).send({ token: token });
};

module.exports = { generateOTP, verifyOTP };
