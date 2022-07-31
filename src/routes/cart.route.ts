import { Request, Response, Router } from "express";
import client, { DB_PREFIX } from "../database";
import database from "../database";
const express = require("express");
const router: Router = express.Router();

router.post("/add/:cartID", function (request: Request, response: Response) {
  try {
    const { cartID } = request.params;

    if (!cartID) {
      throw new Error("Cart ID not found");
    }

    let cart = client.get(`${DB_PREFIX.CART}${cartID}`);

    const item = request.body;
    if (!item?.id) {
      throw new Error("Item ID not found");
    }

    if (cart) {
      const isItemAlreadyInCart = cart.findIndex(
        (itemInCart: any) => itemInCart.id === item.id
      );

      if (isItemAlreadyInCart > -1) {
        cart = cart.map((itemInCart: any) => {
          if (itemInCart.id === item.id) {
            return {
              ...itemInCart,
              quantity: itemInCart.quantity + item.quantity,
            };
          }
          return itemInCart;
        });
      } else {
        cart = cart.concat(item);
      }
    } else {
      cart = [item];
    }

    client.set(`${DB_PREFIX.CART}${cartID}`, cart);

    return response.status(200).json({
      status: true,
      message: `Added to cart`,
    });
  } catch (error: Error | any) {
    console.error(error);
    return response.status(500).json({
      status: false,
      message: error.message || `Something went wrong`,
    });
  }
});

export default router;
