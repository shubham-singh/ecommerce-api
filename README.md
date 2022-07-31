E-Commerce API

**Add To Cart API:** Adds item to cart. If item is already in cart, increases its quantity
```
Method: POST
Endpint: /cart/add/:cartID
Body: 
{
    "id": "1",
    "name": "iPhone 12",
    "price": 119000,
    "quantity": 1
}
```

**Checkout API:** Checkout from cart, if discount code is provided and valid adds discount else throw error
```
Method: POST
Endpoint: /cart/checkout/:cartID
Body:
{
    "discount_code": "10P00001" (Optional)
}
```

**Generate Discount Code API:** Generates a new discount code for every 7th user. Discount code is associated to individual cart and can only be used once. Must provide cardID
```
Method: GET
Endpoint: /admin/generate-discount-code/:cartID
```

**Analyse API:** Get an overview of total items purchased, total amount, total discount and all discount codes.
```
Method: GET
Endpoint: /admin/analyse
```

# How to run this repository?
Clone this repository and run ```npm install```

## Available Scripts
## ```npm run dev```
Runs the app in the development mode.

## ```npm run build```
Builds the app for production to the build folder.