const { findOne } = require("../models/OTP");
const User = require("../models/User");
const mailSender= require("../utils/mailSender");
const bcrypt = require("bcrypt");

//reset passaword token
exports.resetPasswordToken = async(req,res)=>{
    try {
         //get email from body
        const {email} = req.body;

        //check user for email,email validation

        if(!email){
            return res.status(400).json({
                success : false,
                message : "Fill email field"
            })
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Email is not registered"
            })
        } 

        //generate token
        const token = crypto.randomUUID(); 

        //update user by adding token and expiration time
        const updateUser = await User.findOneAndUpdate({email :email},
                                                        {
                                                            token:token,
                                                            resetPasswordExpires:Date.now() + 5*60*1000,
                                                        },
                                                        {new:true},
        )

        //create url
        const url = `http://localhost:3000/update-password/${token}`;

        //send mail containing url

        await mailSender(email,"The link for reset Password",token);

        //return response
        return res.status(200).json({
            success : true,
            message :"Email send Successfully",
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Failed to send mail"
        })
    }
   

}




//reset password

exports.resetPassword=async(req,res)=>{
    try {
        //data fetch
        const {password , confirmPassword , token}= req.body;

        //validation
        if(password!== confirmPassword){
            return res.status(400).json({
                success : false ,
                message : "Password does not match"
            })
        }
        //get user details
        const user = await User.findOne({token : token});
        //if no entry -envalid token
        if(!user ){
            return res.status(400).json({
                success : false ,
                message : "Invalid token"
            })
        }
        //token time expires
        if(user.resetPasswordExpires < Date.now()){
            return res.status(400).json({
                success : false ,
                message : "Link is expired please resend link again"
            })
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password,10);
        //update password
        await User.findOneAndUpdate({token : token},
                                    {
                                        password : hashedPassword,
                                    },
                                {new : true});
        
        return res.status(200).json({
            success : true,
            message : "Password updated successfully"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Failed to reset password"
        })
    }
}