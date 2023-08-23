import express from "express";
import {config} from "dotenv";
import errorMiddleware from "./middlewares/errors.js";
import cookiParser from "cookie-parser";

const app =express();


//  using middleware 
config({path:'./config/config.env'});
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookiParser());



// importing routes path
import user from "./routes/userRoutes.js";
import course from "./routes/courseRoutes.js";
import payment from "./routes/paymentRoutes.js";
import Other from "./routes/otherRoute.js";

//using imported routes from above

app.use('/api/v1',user);
app.use('/api/v1',course);
app.use('/api/v1',payment);
app.use('/api/v1',Other);


export default app;

// using errorMiddleware
app.use(errorMiddleware);