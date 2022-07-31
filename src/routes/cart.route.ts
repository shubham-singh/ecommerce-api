import express, { Router } from "express";
import { addToCart, checkout } from "../controller/cart.controller";

const router: Router = express.Router();

router.post("/add/:cartID", addToCart);

router.post('/checkout/:cartID', checkout);

export default router;
