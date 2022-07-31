import { Request, Response } from "express";
import client, { DB_PREFIX } from "../database";
import { ICart, IDiscountCode } from "../types";
import { getDiscountCode } from "../utils/helper";

/**
 * @description Function to generate a new discount code for every 7th user
 * @param request
 * @param response
 * @returns response
 */
export function generateDiscountCode(request: Request, response: Response) {
  try {
    const { cartID } = request.params;
    const numberOfAccounts = client.getCount(DB_PREFIX.CART);
    const numberOfDiscountCode = client.getCount(DB_PREFIX.DISCOUNT);
    let discountCode = getDiscountCode(numberOfDiscountCode);

    if (numberOfAccounts === 0 || numberOfAccounts % 1 !== 0) {
      throw new Error("Cannot generate discount code");
    } else {
      client.set(`${DB_PREFIX.DISCOUNT}${discountCode}`, {
        valid: true,
        cartID,
      });
    }

    return response.status(200).json({
      status: true,
      discount_code: discountCode,
    });
  } catch (error: Error | any) {
    console.error(error);
    return response.status(400).json({
      status: false,
      message: error.message || "Failed to generate discount code",
    });
  }
}

/**
 * @description Function to give an overview of data
 * @param request 
 * @param response 
 * @returns response
 */
export function analyse(request: Request, response: Response) {
  try {
    const allDiscountCode: string[] = client
      .getAllMatchingKeys(DB_PREFIX.DISCOUNT)
      .map((key) => key.replace(DB_PREFIX.DISCOUNT, ""));


    const allCarts: ICart[] = client.getAllMatchingValues(DB_PREFIX.CART);

    const total: { totalItems: number, totalPrice: number; totalDiscount: number } =
      allCarts.filter((cart) => cart.status === 'closed').reduce(
        (accumulator, current) => {
          accumulator.totalItems += current.items.reduce((acc, cur) => {
            return acc += cur.quantity;
          }, 0)
          accumulator.totalPrice += current.total;
          accumulator.totalDiscount += current.discount;
          return accumulator;
        },
        { totalPrice: 0, totalDiscount: 0, totalItems: 0 }
      );

    return response.status(200).json({
      status: true,
      total_items_purchased: total.totalItems,
      total_discount_amount: total.totalDiscount,
      total_purchase_amount: total.totalPrice,
      discount_codes: allDiscountCode,
    });
  } catch (error: Error | any) {
    console.error(error);
    return response.status(400).json({
      status: false,
      message: error.message || "Failed to get data",
    });
  }
}
