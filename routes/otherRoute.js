import express from "express";
const router =express.Router();

import {getDashboardStats} from "../controllers/otherController.js"
import {isAdmin,isAuthenticated} from "../middlewares/auth.js";

router.route('/admin/getstats').get(isAuthenticated,isAdmin,getDashboardStats);


export default router;