import express, { Router } from "express";
import { generateDiscountCode } from "../controller/admin.controller";

const router: Router = express.Router();

router.get("/generate-discount-code/:cartID", generateDiscountCode);

export default router;