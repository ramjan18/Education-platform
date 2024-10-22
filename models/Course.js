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
      instructor : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        Ref : "User"
      },
      whatYouWillLearn : {
        type : String
      },
      courseContent : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Section"
      }],
      ratingAndReviews : [{
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
      tag :[ {
        type : String
      }],
      category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category"
      },
      studentEnrolled : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
      }]

});

module.exports = mongoose.model("Course",CourseSchema);