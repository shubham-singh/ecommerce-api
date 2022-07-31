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
    status: 'open' | 'closed';
}

export interface IDiscountCode {
    valid: boolean;
    cartID: string
}