const Razorpay = require("razorpay");

exports.instance = new Razorpay({
    key_id : process.en.RAZORPAY_KEY,
    key_secret : process.env.RAZORPAY_SECRETE,
});