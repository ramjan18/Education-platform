const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
        title : {
            type  : String,
            trim : true
        },
        timeDuration : {
            type : String ,
        
        },
        description : {
            type : String
        },
        videoUrl : {
            type : String
        }
});

module.exports = mongoose.model("subsection",SubSectionSchema);