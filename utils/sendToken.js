export const sendToken =(res,user,statusCode,message)=>{

    // getJwtToken user method implmented in usermodel 
    const token =user.getJwtToken();


    const userData={
        _id:user._id,
        name:user.name,
        avatar:user.avatar,
        email:user.email,
        // role:user.role
    }

    const options ={
        httpOnly:true,
        expires:new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000)
    }

    res.status(201).cookie("token",token,options).json({
        success:true,
        user:userData,
        message
    })
    
}