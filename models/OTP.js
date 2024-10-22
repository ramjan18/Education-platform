const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");


const OTPSchema = new mongoose.Schema({
      email : {
        type : String,
        required : true
      },
      otp : {
        type : String,
        required : true
      },
      createdAt:{
        type : Date,
        default : Date.now(),
        expires : 10*60,
      }
});

//function to send email

async function verificationEmail(email,otp){
    try {
        const mailResponse = await mailSender(email , "Verification mail from education Platform",otp);
    } catch (error) {
        console.log("failed to send email :" , error);
    }
    
}

OTPSchema.pre('save',async function(next){
  await  verificationEmail(this.email,this.otp);
  next();
})

module.exports = mongoose.model("OTP",OTPSchema);