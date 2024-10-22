const express = require("express");
const router = express.Router();
const { isInstructor,auth,isAdmin,isStudent } = require("../middlewares/auth");

//import all handlers from course

const {
    createCourse,
    showAllCourses,
    getCourseDetails

} = require("../controllers/Course");


//import all controllers from sections
const {
    createSection,
    updateSection,
    deleteSection
} = require("../controllers/section");


//import all controllrs from subsection
const {
    createSubSection,
    updateSubsection,
    deleteSubsection
} = require("../controllers/SubSection");


//import all controllrs from category
const {
    createCategory,
    showAllCategories,
    categoryPageDetails

} = require("../controllers/Category");

//import all controllrs from category
const {
    createRatingAndReviews,
    getAllReview,
    getAverageRating,
    getReviewsofCourse

} = require("../controllers/RatingAndReview");




// ----------------------------------------------------------------Course routes---------------------------------------------------------------

//course can only be created by instructor
router.post('/createCourse',auth,isInstructor,createCourse);

//add section
router.post('/addSection',auth,isInstructor,createSection);

//update section
router.patch('/updateSection',auth,isInstructor,updateSection);

//delete section
router.delete('/deleteSection',auth,isInstructor,deleteSection);

//add sub section
router.post('/addSubsection',auth,isInstructor,createSubSection);

//update subsection
router.patch('/updateSubsection',auth,isInstructor,updateSubsection);

//delete sub section
router.delete('/deleteSubsection',auth,isInstructor,deleteSubsection);

//delete course





//get all courses
router.get('/getAllCourses',showAllCourses);

//get specific course details
router.get('/getCourseDetails',getCourseDetails);


//-----------------------------------------------------------------Category Routes-------------------------------------------------------------

//create category
router.post("/createCategory", auth, isAdmin, createCategory)

//get all categories
router.get("/showAllCategories", showAllCategories)

//category page 
router.get("/getCategoryPageDetails", categoryPageDetails)



//------------------------------------------------------------Rating and reviews---------------------------------------------------------------

//create rating and reviews
router.post("/createRating", auth, isStudent, createRatingAndReviews)
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllReview);

module.exports = router;