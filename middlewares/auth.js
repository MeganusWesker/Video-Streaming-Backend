import jwt from "jsonwebtoken";
import catchAyncErrors from "./catchAsyncErrors.js"
import {User} from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";


export const isAuthenticated =catchAyncErrors(async(req,res,next)=>{

    const token =req.cookies.token;

    if(!token){
        return next(new ErrorHandler("login first to accesss",400));
    }

    const decodedId=jwt.verify(token,process.env.JWT_SECRET);

    req.user=await User.findById(decodedId._id);

    next();
});

export const isAdmin=(req,res,next)=>{
    if(req.user.role!=="admin"){
        return next(new ErrorHandler(`${req.user.role} not allowed to access this route`,403));
    }

    next();
}