const express = require("express");
const router = express.Router();
const{auth}= require("../middlewares/auth");

//import controllers from profile

const {
    updateProfile,
    deleteAccount,
    getUser
} = require("../controllers/Profile");


//******************************************************************* Profile Routes ****************************************************** */

router.put("/updateProfile",auth,updateProfile);
router.delete("/deleteAccount",auth,deleteAccount);
router.get("/getUser",auth,getUser);

module.exports= router;