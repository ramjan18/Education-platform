const Category = require("../models/Category");

//create categories
exports.createCategory = async( req, res)=> {
    try {
        //get data from body
        const {name , description} = req.body;

        //validate 
        if(!name || !description) {
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        // create entry in db
        const newCategory = await Category.create({
            name : name ,
            description:description,
        })
        return res.status(200).json({
            success : true,
            message : "Category created successfully"
        })
    } catch (error) {
         return res.status(500).json({
            success : false,
            message : "Failed to create tags"
        })
    }
    
}



//get categories

exports.showAllCategories = async (req,res)=> {
    try {
        const allCategories = await Category.find({},{name : true, description : true});
        return res.status(200).json({
            success : true,
            message : "All categories returned successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Failed to get cotegories"
        })
    }
}



//get courses from selected  categories / different catorigoris /top sold

exports.categoryPageDetails = async(req,res) => {

    try {
        
        //get category id
        const {categoryId} = req.body;

        //get selected courses
        const selectedCourses = await Category.findById(categoryId).populate("courses").exec();

        if(!selectedCourses){
            return res.status(404).json({
                success : false,
                message : "Courses not found"
            })
        }

        //get different courses

        const differentCourses = await Category.find(
                                            {
                                                _id: {$ne : categoryId},
                                            }).populate("courses").exec();

        //get most enrolled courses
        const topSellingCourses = await Courses.aggregate([
                                                {
                                                    $project : {
                                                        courseName : 1,
                                                        CourseDescription : 1,
                                                        price : 1,
                                                        thumbnail : 1,
                                                        numberOfStudents : {$size : "$studentEnrolled"},
                                                    }
                                                },
                                                {
                                                    $sort: {numberOfStudents : -1}
                                                }
                                            
        ]);

        //return response
        return res.status(200).json({
            success : true ,
            topSellingCourses,
            selectedCourses,
            differentCourses,
            message : "data fetched succefully"
        })
    } catch (error) {
        console.log(error);
         return res.status(500).json({
            success : false,
            message : error.message
        })
    }  
}