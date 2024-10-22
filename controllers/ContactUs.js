const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const contactUsEmail = require("../mail/templates/contactFormRes");

exports.contactUs = async (req,res) => {
    try {
        const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
  console.log(req.body)
 
    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )
    console.log("Email Res ", emailRes)
   

    //send mail to owner
    await mailSender(process.env.EMAIL,body , subject);

    //return response
    return res.status(200).json({
        success : true,
        message : "mail sent successfully" 
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
    
}