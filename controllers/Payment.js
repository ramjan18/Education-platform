const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollment} = require("../mail/templates/courseEnrollmentEmail");
const {default : mongoose} = require("mongoose");



//capture the payment and initaite the razorpay order

exports.capturePayment = async (req,res) => {
    //get courseid and userid
    const {course_id} = req.body;
    const userId = req.user.id;

    //valid course id
    if(!course_id){
        return res.status(400).json({
            success : false,
            message : "course id not found"
        });
    }
    //valid course details
    let course;
    try {
        course = await Course.findById(course_id);

        if(!course){
            return res.status(400).json({
            success : false,
            message : "course not found"
        });
        }

        //check if user already pay for the same course
    const uId = new mongoose.Types.ObjectId(userId);
    if(course.studentEnrolled.includes(uId)){
        return res.status(400).json({
            success : false,
            message : "Usaer already enrolled"
        })
    }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success : false,
            message : "course not found"
        });
    }

    
    //order create
    const amount = course.price;
    const currency ="INR";

    const options ={
        amount : amount*100,
        currency,
        reciept : Math.random(Date.now()).toString(),
        notes :{
            courseId : course_id,
            userId
        }
    }

    try {
        //initiate payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse)

        return res.status(200).json({
            success :true ,
            courseName : course.courseName,
            courseDescription : course.courseDescription,
            thumbnail : course.thumbnail,
            orderId : paymentResponse.id,
            currency : paymentResponse.currency,
            
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false ,
            message : "could not initiate order",
        })
    }
     
}


//verify signature of razorpay and server

exports.verifySignature = async(req,res) => {
    const webhookSecret ="12345678";

    const signature = req.headers["x-razorpay-signature"];

    crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log("Payment is authorized");

        const {courseId , userId} = req.body.payload.payment.entity.notes;

        try {
            //fullfill the action

            //find course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                                                    {_id : courseId},
                                                    {$push : {studentsEnrolled : userId}},
                                                    {new : true},
            );
            if(!enrolledCourse){
                return res.status(500).json({
                    success : false,
                    message : "Course not Found",
                });
            }

            console.log(enrolledCourse);


            //find the student and add the course to their list enrolled courses

            const enrolledStudent = await User.findOneAndUpdate(
                                                        {_id : userId},
                                                        {$push : {
                                                            courses:courseId
                                                        }},
                                                        {new : true},
            );


            //send mail

            const emailResponse = await mailSender(
                                        enrolledStudent.email,
                                        "Congratulation from edu tech",
                                        "Congratulations , you are onboarded"
            );

            return res.status(200).json({
                success : true,
                message : "Signature verified and course added"
            })

        } catch (error) {
             console.log(error);
            return res.status(500).json({
            success : false ,
            message : error.message,
        })
        }
    }
    else{
        return res.status(400).json({
            success : false,
            message : "Invalid request"
        })
    }
}