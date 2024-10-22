const Section = require("../models/Section");
const Course = require("../models/Course");


exports.createSection = async(req,res) =>{
    try {
        //data fetch
        const {sectionName , courseId} = req.body;
    //data validation
    if(!sectionName || !courseId) {
        return res.status(400).json({
            success : false ,
            message : "all fields are required"
        })
    }
    //create section
    const newSection = await Section.create({sectionName});
    //update course with section ObjectId
    const updatedCourse = await Course.findByIdAndUpdate(courseId,
                                {
                                    $push : {
                                        courseContent : newSection._id,
                                    }
                                },{new : true}).populate({
                                    path: "courseContent", 
                                    populate: {
                                        path: "subSection" 
                                    }
                                })
    //return response

    return res.status(200).json({
        success : true,
        message : "Section created successfully",
        updatedCourse
    })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Failed to create section",
            
        })
    }
    
}


//update section

exports.updateSection = async(req,res)=>{
    try {
        //data input
        const {sectionName,sectionId} = req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
            success : false,
            message : "Section name required",
            
        })
        }
        //update data
        const updatedSection = await Section.findByIdAndUpdate(sectionId ,
                                                                {
                                                                    sectionName : sectionName,
                                                                } ,
                                                                 {new : true}  
                                                                    )
        //return res
          
        return res.status(200).json({
            success : true,
            message : "Section updated successfully",
            updatedSection
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            message : "Failed to update"
        })
    }
}


//delete section

exports.deleteSection = async (req,res) => {
    try {
        const {sectionId} = req.params;

        //delete 
        const deletedSection = await Section.findByIdAndDelete(sectionId);

        //return response
        return res.status(200).json({
            success : true,
            message : "Section deleted succesfully",
            deletedSection
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            message : "Failed to delete Section"
        })
    }
}

