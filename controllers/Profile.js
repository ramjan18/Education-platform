const Profile = require("../models/profile");
const User = require("../models/User");

exports.updateProfile = async(req,res) => {
    try {
        //get data
        const {dateOfBirth="" ,about="" , gender,contactNumber }= req.body;
        const id = req.user.id;
        //validate
        if( !gender || !contactNumber){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }
        //update
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const updatedProfile = await Profile.findByIdAndUpdate(profileId,
                                                                {
                                                                    dateOfBirth:dateOfBirth,
                                                                    about : about,
                                                                    gender : gender,
                                                                    contactNumber : contactNumber
                                                                });
        
        return res.status(200).json({
            success : true,
            message : "profile updated successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            message : "Failed to uodate profile"
        })
    }
    
}



//deleteAccount

exports.deleteAccount = async (req,res) =>{
    try {
        //get id
        const id = req.user.id;
        //delete profile
        const userDetails = await User.findById(id);
        const profileId = await userDetails.additionalDetails;
        await Profile.findByIdAndDelete(profileId);
        //delete user
        await User.findByIdAndDelete(id);

        return res.status(200).json({
            success : true ,
            message : "User deleted successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Failed to delete user"
        })
    }
}


//get user details
exports.getUser = async(req,res)=>{

    try {
        //get id
        const id = req.user.id;
        //get details
        const userDetail = await User.findById(id).populate("additionalDetails").exec(); 
        
         return res.status(200).json({
            success : true ,
            message : "User data fetched successfully",
            userDetail
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Failed to get user details"
        })
    }
   

}
