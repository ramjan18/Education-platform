const RatingAndReviews= require("../models/RatingAndReviews");
const Course = require("../models/Course");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");


//create rating and review

exports.createRatingAndReviews = async(req,res)=> {
    
    try {
         //get data from body
         const{rating , review , courseId}= req.body;
        //validate data
        // if(!rating || !review){
        //     //response with code 400(bad request)
        //     return res.status(400).json({
        //         success : true,
        //         message : "All fields are required"
        //     })
        // }
        //get user id
        const userId = req.user.id;
        //validate user
        const userDetails = await User.findById(userId);
        if(!userDetails){
            //response with code 404(not found)
            return res.status(404).json({
                success : true,
                message : "User not exist"
            })
        }

        //check if user is enrolled or not
        const courseDetails = await Course.findOne({
                                            _id:courseId,
                                            studentEnrolled: {$eleMatch : {$eq : userId}}
        });

        if(!courseDetails){
            return res.status(404).json({
                success : false,
                message : "Student is not enrolled in the course"
            })
        }

        //check if user already review the course
        const alreadyReviewed = await RatingAndReviews.findOne({
                                                   user:userId,
                                                   course : courseId  
        });

        if(alreadyReviewed){
            return res.status(404).json({
                success : false,
                message : "Already reviewed by user"
            });
        }

        //create entry in db
        const newRatingAndReview = await RatingAndReviews.create({
                                               rating : rating,
                                               review : review,
                                               user :userId,
                                               course:courseId
        })
        //update course
        const updatedCourse = await Course.findByIdAndUpdate(courseId ,
                                                           {
                                                            $push : {
                                                            ratingAndReviews : newRatingAndReview._id
                                                            }
                                                           } ,{new:true});
        //return response with status code 200 (success)
        return res.status(200).json({
            success : true,
            message : "Rating and review created"
        })
    } catch (error) {
        console.log(error);
        //status code 500 (internal server error)
        return res.status(500).json({
            success : false,
            message : "Failed to create rating"
        })
    }
   
}



//get average rating and review
exports.getAverageRating =async (req,res) => {

    try {
        //get course id
         const {courseId}= req.body;

        // claculate average rating

        const result = await RatingAndReviews.aggregate([
            {
                $match : {
                    course : mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group : {
                    _id : null,
                    averageRating : {$avg : "$rating"},
                }
            }
        ])

        //return rating
        if(result.length > 0){
            return res.status(200).json({
                success : true,
                averageRating : result[0].averageRating,
            })
        }

        //if no review exist
        return res.status(200).json({
            success : true,
            message :'Average rating 0,no rating is given till now',
            averageRating:0
        })
        
    } catch (error) {
         console.log(error);
        //status code 500 (internal server error)
        return res.status(500).json({
            success : false,
            message : "Failed to get average rating",
    
        })
    }
    
}


//getAll rating

exports.getAllReview = async(req,res)=> {
    try {
        //get all reviews
        const allReviews = (await RatingAndReviews.find({}))
                                                    .sort({rating:"desc"})
                                                    .populate({
                                                        path:"user",
                                                        select : "firstName lastName email image"
                                                    })
                                                    .populate({
                                                        path : "course",
                                                        select : "courseName"
                                                    }).exec();
        
         return res.status(200).json({
            success : true,
            message : "All reviews fetched successfully",
            data : allReviews
         })                                           
    } catch (error) {
         console.log(error);
        //status code 500 (internal server error)
        return res.status(500).json({
            success : false,
            message : error.message,
    
        })
    }
}

//get reviews for one course

exports.getReviewsofCourse= async(req,res) => {

    try {
        //get course id
        const {courseId} = req.body;

        //get reviews based on the course id
        const courseReviews = await RatingAndReviews.find({course : courseId})
                                                    .sort({rating : "desc"})
                                                    .populate({
                                                            path:"user",
                                                            select : "firstName lastName email image"
                                                        })
                                                        .populate({
                                                            path : "course",
                                                            select : "courseName"
                                                        }).exec();

        return res.status(200).json({
            success : true,
            message : "Reviews fetched successfully",
            data : courseReviews
        })         
    } catch (error) {
        console.log(error);
        //status code 500 (internal server error)
        return res.status(500).json({
            success : false,
            message : error.message,
    
        })
    }
                                           
}