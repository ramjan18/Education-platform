const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async(req,res,next)=>{
    // try {
        //extract token
        // console.log(req.cookies);
        const token =req.cookies.token
                     || req.body.token 
                    ||req.header("Authorization").replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                success : false,
                message : "Token is missing"
            })
        }
        // console.log(token);

        //verify token
        try {
            const decode= jwt.verify(token,process.env.JWT_SECRET);
            
            req.user=decode;
        } catch (error) {
            return res.status(401).json({
                success : false,
                message : "token is invalid",
            })
        }
        next();


    // } catch (error) {
    //     return res.status(500).json({
    //         success : false,
    //         message: "Something went wrong while validating a token"
    //     });
    // }
}



//isStudent

exports.isStudent = async(req,res,next)=>{
    try {
        if(req.user.accountType !== "student"){
            return res.status(401).json({
                success : false,
                message : "This route is for student only"
            })
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            message :"User role cannot be verifeid please try again"
        })
    }
}



//isInstructor
exports.isInstructor = async(req,res,next)=>{
    try {
        if(req.user.accountType !== "instructor"){
            return res.status(401).json({
                success : false,
                message : "This route is for instructor only"
            })
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            message :"User role cannot be verifeid please try again"
        })
    }
}


//iaAdmin

exports.isAdmin = async(req,res,next)=>{
    try {
        if(req.user.accountType !== "admin"){
            return res.status(401).json({
                success : false,
                message : "This route is for admin only"
            })
        }
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            message :"User role cannot be verifeid please try again"
        })
    }
}