import express  from "express";

const router =express.Router();

import { isAuthenticated } from "../middlewares/auth.js";


import {getSubscription,paymentVerification,getApiKey} from "../controllers/paymentController.js";

router.route('/subscribe').get(isAuthenticated,getSubscription);

router.route('/razorpaykey').get(getApiKey);

router.route('/paymentverification').post(isAuthenticated,paymentVerification);

export default router;