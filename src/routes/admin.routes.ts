import express, { Router } from "express";
import { analyse, generateDiscountCode } from "../controller/admin.controller";

const router: Router = express.Router();

router.get("/generate-discount-code/:cartID", generateDiscountCode);

router.get('/analyse', analyse);


export default router;