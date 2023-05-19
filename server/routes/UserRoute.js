const { Router } = require("express");
const { generateOTP, verifyOTP } = require("../controllers/UserController");

const router = Router();

router.route("/getOTP").post(generateOTP);
router.route("/verifyOTP").post(verifyOTP);

module.exports = router;
