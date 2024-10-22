const express = require("express");
const router = express.Router();
const {auth} = require('../middlewares/auth');

const {
    signUp,
    login,
    changePassword,
    sendOTP
} = require('../controllers/Auth');


//import controllers from profile

const {
    resetPassword,
    resetPasswordToken
} = require('../controllers/ResetPassword');



//============================================================= user routes ================================================================
// router.post('/signUp',signUp);
router.post('/login',login);
router.post('/sendOTP',sendOTP);
router.post('/changePassword',auth,changePassword);
router.post('/signUp',signUp);


//*************************************************************** reset password routes ****************************************************/

router.post('/reset-password-token',auth,resetPasswordToken);

router.post('/reset-password' , resetPassword);

module.exports=router;


