const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  otp: { type: Number, min: 000000, max: 999999 },
  otp_fails: { type: Number, default: 0 },
  otp_created: { type: Date },
  login_restricted: { type: Date },
});
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
