import express from "express";
const router =express.Router();

import { isAuthenticated,isAdmin } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js"

import {register,
        verify,
        login,
        logout,
        updateProflie,
        changePassword,
        resetPassword,
        forgotPassword,
        addToPlayList,
        removeFromPlaylist,
        getAllUsers,
        deleteUser,
        updateUser,
        getMyProfile,
        deleteMyProfile} from "../controllers/userController.js";


// router.route('/user').get((req,res,next)=>{
//    res.send("hey there kid"); // same as this router.route('/users').get(heyThere);
// });

router.route('/register').post(singleUpload,register);
router.route('/login').post(login);
router.route('/forgotpassword').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);


router.route('/verify').post(isAuthenticated,verify);
router.route('/logout').get(isAuthenticated,logout);
router.route('/updateprofile').put(isAuthenticated,singleUpload,updateProflie);
router.route('/updatepassword').put(isAuthenticated,changePassword);
router.route('/addtoplaylist').post(isAuthenticated,addToPlayList);
router.route('/removefromplaylist').delete(isAuthenticated,removeFromPlaylist);
router.route('/me').get(isAuthenticated,getMyProfile).delete(isAuthenticated,deleteMyProfile);

//admin routes

router.route('/admin/users').get(isAuthenticated,isAdmin,getAllUsers)
router.route('/admin/user/:id').put(isAuthenticated,isAdmin,updateUser)
router.route('/admin/user').delete(isAuthenticated,isAdmin,deleteUser)




export default router;