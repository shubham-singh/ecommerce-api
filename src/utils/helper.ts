export function getDiscountCode(count: number): string {
    const prefix = '10P';
    return `${prefix}${String(count).padStart(5, '0')}`
}