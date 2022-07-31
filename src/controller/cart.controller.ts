import { Request, Response } from "express";
import client, { DB_PREFIX } from "../database";
import { ICart, IItem } from "../types";

/**
 * @description Function to add item to cart. If item is already in cart, increases its quantity
 * @param request
 * @param response
 * @returns response
 */
export function addToCart(request: Request, response: Response) {
  try {
    const { cartID } = request.params;

    let cart: ICart | undefined = client.get(`${DB_PREFIX.CART}${cartID}`);

    const item: IItem = request.body;
    if (!item?.id) {
      throw new Error("Item ID not found");
    }

    if (item.quantity < 1) {
      throw new Error("Item Quantity cannot be less than 1");
    }

    if (cart) {
      const isItemAlreadyInCart = cart.items.findIndex(
        (itemInCart: IItem) => itemInCart.id === item.id
      );

      if (isItemAlreadyInCart > -1) {
        cart.items = cart.items.map((itemInCart: IItem) => {
          if (itemInCart.id === item.id) {
            return {
              ...itemInCart,
              quantity: itemInCart.quantity + item.quantity,
            };
          }
          return itemInCart;
        });
      } else {
        cart.items = cart.items.concat(item);
      }

      cart = {
        ...cart,
        total: cart.items.reduce(
          (accumulator: number, current: IItem) =>
            (accumulator += Number(current.price) * Number(current.quantity)),
          0
        ),
      };
    } else {
      cart = {
        items: [item],
        total: Number(item.price) * Number(item.quantity),
        discount: 0,
      };
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
}

/**
 * @description Function to checkout, if discount code is valid adds discount else throw error
 * @param request
 * @param response
 * @returns response
 */
export function checkout(request: Request, response: Response) {
  try {
    const { cartID } = request.params;

    let cart: ICart | undefined = client.get(`${DB_PREFIX.CART}${cartID}`);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const { discountCode } = request.body;
    const isDiscountCodeValid = client.get(
      `${DB_PREFIX.DISCOUNT}${discountCode}`
    );

    if (!isDiscountCodeValid) {
      throw new Error("Discount code is not valid");
    }

    cart.discount = Math.round((Number(cart.total) / 100) * 10);

    client.set(`${DB_PREFIX.CART}${cartID}`, cart)

    return response.status(200).json({
      status: true,
      message: 'Discount code successfully applied',
    });
  } catch (error: Error | any) {
    console.error(error);
    return response.status(500).json({
      status: false,
      message: error.message || `Something went wrong`,
    });
  }
}