const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require ("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");


//create course 
exports.createCourse = async (req,res)=>{
    try {
        //get data from body
        const {courseName , courseDescription , whatYouWillLearn , price , tag ,category} = req.body;

        //get thumnail
        const thumbnail = req.files.thumbnailImage; 
        
        //validate
        if(!courseName || !courseDescription  || !whatYouWillLearn || !price || !tag || !category){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);

        if(!instructorDetails){
            return res.status(404).json({
                success : false,
                message : "Instructor details not found"
            }) 
        }

        //check for tag validation
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
             return res.status(404).json({
                success : false,
                message : "Tag details not found"
            }) 
        } 

        //upload image on cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)
        
        //create entry of  course in db

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor : instructorDetails._id,
            price,
            tag,
            whatYouWillLearn,
            category : categoryDetails._id,
            thumbnail : thumbnailImage.secure_url,
        })
         
        //add course to the instructor schema

        await User.findByIdAndUpdate(
            {_id : instructorDetails._id},
            {
                $push : {
                    courses : newCourse._id,
                }
            },
            {new : true});

        
        //add course to tag 
        await Category.findByIdAndUpdate(
            {_id : categoryDetails._id},
            {
                $push : {
                    course : newCourse._id
                }
            },
        {new : true});

        return res.status(200).json({
            success : true,
            message : "Course created successfully",
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Failed to create course"
        })
    }
}




//get all courses

exports.showAllCourses = async(req,res)=>{
    try {
        const allCourses = await Course.find({});
                                // .populate("ratingAndReviews")
                                // .populate(
                                //     {
                                //         path:"courseContent",
                                //         populate : {
                                //             path:"subSection"
                                //         }
                                //     }
                                // );
        
        return res.status(200).json({
            success:true,
            message : "Data for courses fetched successfully",
             allCourses
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false ,
            message : "Failed to get courses"
           
        })
    }
}



//get course details

exports.getCourseDetails = async(req,res) => {

    try {
         const {courseId} = req.body;

        //find courseDetails

        const courseDetails = await Course.findById(courseId).
                                            populate(
                                                {
                                                    path:"instructor",
                                                    populate:{
                                                        path : "additionalDetails",
                                                    } 
                                                }
                                            ).populate("category")
                                            .populate("ratingAndReviews")
                                            .populate({
                                                path : "courseContent",
                                                populate : {
                                                    path : "subSection",
                                                }
          
                                          })
                                       .exec();
        
        //return res with status code 404 (not found)
        if(!courseDetails){
            return res.status(404).json({
                success : false,
                message : "Course details not found",
                courseDetails
            })
        }

        return res.status(200).json({
            success : true,
            message : "Course details fetched successfully",
            courseDetails
        })
        
    } catch (error) {
        //return res with status code 500(internal server error)
         console.log(error);
        return res.status(500).json({
            success : false ,
            message : "Failed to get course details" 
        })
    }
       
};

//deleteCourse
