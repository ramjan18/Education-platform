const User = require('../models/User');
const otpGenerator = require('otp-generator');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const mailSender = require('../utils/mailSender');
const Profile =require("../models/profile");

require("dotenv").config();

//send otp
exports.sendOTP = async(req,res)=>{
    try {
        
        const {email}= req.body;

        //check user already exist
       const userExist =  await User.findOne({email : email});

       //if user exist
       if(userExist){
        return res.status(401).json({
            success : false,
            message : "User already exist",
        })
       }

       //generate OTP
       let otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
       });
       console.log(OTP);

       //check otp is unique or not
       let otpExist = await OTP.findOne({otp : otp});

    //    while(otpExist === otp){
    //     otp = otpGenerator.generate(6,{
    //     upperCaseAlphabets:false,
    //     lowerCaseAlphabets:false,
    //     specialChars:false
    //    });

    //    otpExist = await OTP.findOne({otp : otp});
    //    }

       const otpBody = await OTP.create({email,otp});
       console.log(otpBody);

      return res.status(200).json({
        success:true,
        message: "OTP created successfully",
        otp
       })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : error.message,
        })
    }
}



//signup

exports.signUp = async(req,res)=>{
    try {
          const {firstName , lastName , email , accountType ,otp,
        password , confirmPassword 
    } = req.body;

    //validate data

    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(400).json({
            success : false,
            message : "All fields are required"
        })
    }

    //check 2 passwords are correct or not 
    if(password !== confirmPassword){
        return res.status(400).json({
            success : false,
            message : "password does not match"
        })
    }

    //check if user already exist

    const userExist = await User.findOne({email :email});
    if (userExist){
        return res.status(400).json({
            success : false,
            message : "User already exist"
        })
    }

    //find most recent otp
    const recentOtp = await OTP.find({email :email}).sort({createdAt : -1}).limit(1);
    //validate otp
    if (recentOtp.length == 0){
        return res.status(400).json({
            success : false,
            message : "OTP not found"
        })
    }

    //verify otp
    if(otp !== recentOtp[0].otp){
        return res.status(400).json({
            success : false,
            message : "Invalid Otp"
        })
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password,10);

    //create entry in db

    const profileDetails = await Profile.create({
        gender : null,
        dateOfBirth : null,
        about :null,
        contactNumber:null
    });

    const user = await User.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        accountType,
        additionalDetails : profileDetails._id,
        image : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })

    //return res

    return res.status(200).json({  
        success:true,
        message : "User registered successfully"
    })
        
    } catch (error) {
        console.log("Failed to register User : ", error);
        return res.status(500).json({
            success : false,
            message : "Failed to create user please try again"
        })
    }
    
}



//login
exports.login = async(req,res)=>{

    try {
        //get data from body
        const {email,password} = req.body;
        //validate details
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        //check user is registered or not
        const userExist = await User.findOne({email:email});

        if(!userExist){
            return res.status(400).json({
                success : false,
                message:"User not found"
            })
        } 
        //authenticate user and generate jwt  
       console.log(userExist.password);
        if (await bcrypt.compare(password,userExist.password)){
           const payload = {
            email :userExist.email, 
            id : userExist._id,
            accountType : userExist.accountType
           }

           const token =  jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn : "2h"
           });
           userExist.token=token;
           userExist.password= undefined;

           //create cookie and send response
           const options = {
            expires : new Date(Date.now() + 3*24*60*60*1000),
            httpOnly :true
           }
           res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            userExist, 
            message: "logged in successfully"
           })
        }
        else{
            return res.status(401).json({
                success : false,
                message:"Invalid Credentials"
            })
        }
        
       
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"login failed please try again"
        })
    }
    
}




//change password

exports.changePassword =async(req,res)=>{

    try {
         //get user data
        const userId = req.user.id;
        const userDetails = await User.findById(userId);

        if(!userDetails){
            return res.status(401).json({
                success : false,
                message : "User not found"
            })
        }
        //get data from body
        const {oldPassword ,newPassword , confirmPassword} = req.body;
        //get old password
        //validation
        if( !oldPassword || !newPassword || !confirmPassword){
            return res.status(400).json({
                success:false,
                message : "All fields are required"
            })
        }
        

        if(!(await bcrypt.compare(oldPassword,userDetails.password))){
            return res.status(400).json({
                success : false,
                message : "Incorrect password"
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success : false,
                message : " password can not match"
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(newPassword,10);

        //update password in db
        const updatedUser = await User.findByIdAndUpdate(userId,
                                        {password : hashedPassword},
                                        {new:true}
        )
        //send mail --password updated
        await mailSender(updatedUser.email,
                            "password update",
                            "password updated succesfully"
        )
        //return response
        return res.status(200).json({
            success : true,
            message : "password updated successfully"
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to update password"
        })
    }
}