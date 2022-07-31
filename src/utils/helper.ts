// Returns a discount code (ex: 10P00001)
export function getDiscountCode(count: number): string {
    const prefix = '10P';
    return `${prefix}${String(count).padStart(5, '0')}`
}