const mongoose = require("mongoose");


const SectionSchema = new mongoose.Schema({
       sectionName : {
        type : String
       },
       subSection: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Subsection"
       }]
});

module.exports = mongoose.model("Section",SectionSchema); 