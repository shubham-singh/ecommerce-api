export interface IItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface ICart {
    items: IItem[];
    total: number;
    discount: number;
}

export interface IDiscountCode {
    valid: boolean;
    cartID: string
}