import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import {User} from "../models/userModel.js";
import { Payment } from "../models/paymentModel.js";
import { instance } from "../server.js";
import crypto from "crypto";

export const getSubscription =catchAsyncErrors(async(req,res,next)=>{

    
    const user =await User.findById(req.user._id);

    if(user.role==="admin"){
        return next(new ErrorHandler("admin need not to buy subcription",400));
    }

   const subscription= await instance.subscriptions.create({
        plan_id: process.env.PLAN_ID,
        customer_notify: 1,
        total_count: 12,
        
      });

      user.subscription.id=subscription.id;
      user.subscription.status=subscription.status;

      await user.save();

      res.status(201).json({
        success:true,
        subscriptionId:subscription.id
      })
});

export const paymentVerification =catchAsyncErrors(async(req,res,next)=>{

  console.log('hell')

  const {razorpay_payment_id,razorpay_signature,razorpay_subscription_id} =req.body;

  


  const user =await User.findById(req.user._id);

  const subcriptionId=user.subscription.id;

  const genreatedSignature =crypto.createHmac('sha256',process.env.RAZORPAY_SECRET_KEY).update(`${razorpay_payment_id}|${subcriptionId}`).digest('hex');

      

    const isAuthentic=genreatedSignature===razorpay_signature;

    if(!isAuthentic){
      return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);
    }

      await Payment.create({
        razorpay_payment_id,
        razorpay_signature,
        razorpay_subscription_id
      });

      user.subscription.status="active";

      await user.save();

      res.redirect(`${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`);
    
});

export const getApiKey=(req,res,next)=>{
  res.status(200).json({success:true,key:process.env.RAZORPAY_API_KEY});
}

export const cancelSubscription =catchAsyncErrors(async(req,res,next)=>{
 
    const user =await User.findById(req.user._id);

    const subscriptionId=user.subscription.id;

    await instance.subscriptions.cancel(subscriptionId);

    const payment =await Payment.findOne({razorpay_order_id:subscriptionId});

    let refund=false;

    const paymentDate=Date.now()-payment.createdAt;

    const refundTime=process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;

    if(refundTime>=paymentDate){
      await instance.payments.refund(payment.razorpay_payment_id);
      refund=true;
    }

    await payment.remove();
    user.subscription.id=undefined;
    user.subscription.status=undefined;

    await user.save();

    res.status(200).json({
        success:true,
        message:refund ? "subscription cancelled ,You will get you're refund within 7days":
        "subscription cancelled ,no refund initated as subscription cancled after 7 days"
    });

});