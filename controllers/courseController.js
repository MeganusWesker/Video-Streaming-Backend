import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import {Course} from "../models/courseModel.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";


export const createCourse =catchAsyncErrors(async(req,res,next)=>{

    const {title,description,category,createdBy} =req.body;

     console.log(req.body);
   
    
   
    const file =req.file;

    if(!title || !description || !category || !createdBy || !file){
        return next(new ErrorHandler("please enter all fileds",400));
    }

    const fileUrl=getDataUri(file);

    const myCloud =await cloudinary.v2.uploader.upload(fileUrl.content);

   

   await Course.create({
    title,
    description,
    category,
    createdBy,
    poster:{
       public_id:myCloud.public_id,
       url:myCloud.url
    }

   });

   res.status(201).json({
    success:true,
    message:"Course has been created"
   });
});


export const getAllCourses =catchAsyncErrors(async (req,res,next)=>{

    const keyword = req.query.keyword || "";
    const category = req.query.category || "";


    const courses=await Course.find({
        title:{
            $regex:keyword,
            $options:"i"
        },
        category:{
            $regex:category,
            $options:"i"
        }

    }).select("-lectures");

    res.status(201).json({
        success:true,
        courses
     });
});

export const getCourseLectures =catchAsyncErrors(async (req,res,next)=>{

   const course =await Course.findById(req.params.id);

   if(!course){
    return next(new ErrorHandler("course not found",404));
   }

   course.views+=1;
   await course.save();

    res.status(201).json({
        success:true,
        course
     });
});

export const addLectures =catchAsyncErrors(async(req,res,next)=>{

    const {title,description} =req.body;
    const {id}=req.params;
    const file=req.file;

    if(!title || !description || !file){
        return next(new ErrorHandler("please enter all fileds",400));
    }

    const course =await Course.findById(id);

    if(!course){
        return next(new ErrorHandler("course not found ",404));
    }

    const fileUrl=getDataUri(file);

    const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content,
        {
            resource_type:"video",
            folder:"videoStreaming"
       
        });

    course.lectures.push({
        title,
        description,
        video:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    });

    course.numOfVideos=course.lectures.length;

    await course.save();

    res.status(201).json({
        success:true,
        message:"lectures added successfully"
     });
});

export const deleteCourse =catchAsyncErrors(async(req,res,next)=>{

    const {id}=req.params;

    const course =await Course.findById(id);

    if(!course){
        return next(new ErrorHandler("course not found ",404));
    }

    await cloudinary.v2.uploader.destroy(course.poster.public_id);

    for(let i=0; i<course.lectures.length; i++){
        await cloudinary.v2.uploader.destroy(course.lectures[i].video.public_id,{resource_type:"video"});
    }
  
    await course.remove();

    res.status(201).json({
        success:true,
        message:"course deleted succefully"
     });
});

export const deleteLecture =catchAsyncErrors(async (req,res,next)=>{
 
    const {lectureId,courseId}=req.query;

    console.log(lectureId);
    console.log(courseId)

    const course =await Course.findById(courseId);

    if(!course){
        return next(new ErrorHandler("course not found ",404));
    }

    const lecture=course.lectures.find(item=>{
        if(item._id.toString()===lectureId){
            return item;
        }
    });

    await cloudinary.v2.uploader.destroy(lecture.video.public_id,{resource_type:"video"});

    course.lectures=course.lectures.filter(item =>{
        if(item._id.toString()!==lectureId){
            return item;
        }
    });

    course.numOfVideos=course.lectures.length;

    await course.save();

    res.status(200).json({
        success:true,
        message:"lecture deleted succefully"
     });
});