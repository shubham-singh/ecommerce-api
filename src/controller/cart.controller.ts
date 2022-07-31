import { Request, Response } from "express";
import client, { DB_PREFIX } from "../database";
import { ICart, IDiscountCode, IItem } from "../types";

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
        status: 'open'
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
  const { cartID } = request.params;
  try {
    let cart: ICart | undefined = client.get(`${DB_PREFIX.CART}${cartID}`);

    if (!cart) {
      throw new Error("Cart not found");
    }
    
    if (cart.status === 'closed') {
      throw new Error("You already checkout out this cart. Please create a new one");
    }

    const { discount_code } = request.body;

    if (discount_code) {
      const validDiscountCode: IDiscountCode | undefined = client.get(
        `${DB_PREFIX.DISCOUNT}${discount_code}`
      );
  
      if (!validDiscountCode) {
        throw new Error("Discount code is not valid");
      }
  
      if (validDiscountCode.cartID !== cartID) {
        throw new Error("Code not valid for the user");
      }
  
      if (!validDiscountCode.valid) {
        throw new Error("Discount code already used");
      }

      cart.discount = Math.round((Number(cart.total) / 100) * 10);
    }

    cart.status = 'closed';

    client.set(`${DB_PREFIX.CART}${cartID}`, cart);

    response.status(200).json({
      status: true,
      message: "Order Placed :)",
    });

    client.set(`${DB_PREFIX.DISCOUNT}${discount_code}`, {
      valid: false,
      cartID,
    });
    
    return;
  } catch (error: Error | any) {
    console.error(error);
    return response.status(500).json({
      status: false,
      message: error.message || `Something went wrong`,
    });
  }
}
