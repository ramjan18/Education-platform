const mongoose = require('mongoose');

const RatingAndReviews = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    rating :{
        type : Number,
        required : true
    },
    review : {
        type : String,
        trim : true
    }
})

module.exports = mongoose.model("RatingAndReviews",RatingAndReviews);