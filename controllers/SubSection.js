const SubSection = require("../models/Subsection");
const Section = require("../models/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploader");


//create subsection
exports.createSubSection = async(req,res) => {
    try {
        //get data from body
        const {title , timeDuration , description , sectionId} =req.body;

        //extract file
        const video = req.files.videoFile;
        //validate
        if(!title || !timeDuration || !description ){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        //upload vedio to cloudinary
        const uploadedVideo = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create subsection
        const newSubsection = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl :uploadedVideo.secure_url ,
        });
        //add subsection to section
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
                                                                {
                                                                    $push : {
                                                                        subSection : newSubsection._id,
                                                                    }
                                                                },{new : true}).populate("subSection")
        //return response
        return res.status(200).json({
            success : true,
            message : "Subsection created successfully",
            updatedSection
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Failed to create subsection"
        })

    }
    
}



//update subsection


exports.updateSubsection = async(req,res) => {

    try {
          //get data from body
        const {title , timeDuration , description,subSectionId } =req.body;

        //extract file
        const video = req.files.videoFile;
        //validate
        if(!title || !timeDuration || !description ){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        //upload vedio to cloudinary
        const uploadedVideo = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create subsection
        const updatedSubsection = await SubSection.findByIdAndUpdate(subSectionId ,{
            title,
            timeDuration,
            description,
            videoUrl :uploadedVideo.secure_url ,
        });

        //return response
        return res.status(200).json({
            success : true,
            message : "Subsection updated successfully",
            
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message : "failed to update Subsection"
        })
    }
  

}


 //delete subsection
exports.deleteSubsection = async(req,res) => {

    try {
        //get the id 
        const id = req.params._id;

        //delete subsection
        const deletedSubsection = await SubSection.findByIdAndDelete(id);

        return res.status(200).json({
            success : true,
            message : "Subsection deleted successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message : "failed to delete Subsection"
        })
    }    
}