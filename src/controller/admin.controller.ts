import { Request, Response } from "express";
import client, { DB_PREFIX } from "../database";
import { getDiscountCode } from "../utils/helper";

/**
 * @description Function to generate a new discount code for every 7th user
 * @param request
 * @param response
 * @returns
 */
export function generateDiscountCode(request: Request, response: Response) {
  try {
    const { cartID } = request.params;
    const numberOfAccounts = client.getCount(DB_PREFIX.CART);
    const numberOfDiscountCode = client.getCount(DB_PREFIX.DISCOUNT);
    let discountCode = getDiscountCode(numberOfDiscountCode);

    if (numberOfAccounts === 0 || numberOfAccounts % 6 !== 0) {
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
