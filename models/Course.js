const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
      courseName : {
        type : String,
        trim : true,
        required : true
      },
      courseDescription: {
        type : String,
        trim : true,
        
      },
      intructor : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        Ref : "User"
      },
      whatYouWillLearn : {
        type : String
      },
      courseContent : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Section"
      },
      retingAndReviews : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "RatingAndReviews",
      }],
      price : {
        type : Number,
        required : true
      },
      thumbnail : {
        type : String,
        required : true
      },
      tag : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Tag"
      },
      studentEnrolled : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
      }

});

module.exports = mongoose.model("Course",CourseSchema);