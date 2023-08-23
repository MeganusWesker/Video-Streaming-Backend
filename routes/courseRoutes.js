import express from "express";
const router =express.Router();

//importing middlewares 
import singleUpload from "../middlewares/multer.js";
import {isAdmin,isAuthenticated} from "../middlewares/auth.js";


// importing all functions 
import {createCourse,
        getAllCourses,
        getCourseLectures,
        addLectures,
        deleteCourse,
        deleteLecture} from "../controllers/courseController.js";


router.route('/createcourse').post(singleUpload,isAuthenticated,isAdmin,createCourse);

router.route('/courses')
                 .get(getAllCourses);

router.route('/course/:id')
.post(isAuthenticated,isAdmin,singleUpload,addLectures)
.delete(isAuthenticated,isAdmin,deleteCourse)
                

router.route('/getcourselectures/:id').get(getCourseLectures);

router.route('/deletelecture').delete(isAuthenticated,isAdmin,deleteLecture);

export default router;