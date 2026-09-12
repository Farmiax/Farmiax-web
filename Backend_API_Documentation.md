# Farmiax Complete API Specification

> **Message to the Backend Developer:**  
> Use this document as your exact guide for what the frontend sends and expects. All your controllers must match these routes, methods, and JSON bodies. **You can directly import the `Updated_Farmiax_Postman_Collection.json` (which I will provide next) into Postman to test all of these easily.**

**Base URL**: `https://farmiax-web-backend.onrender.com/api/v1`

---

## 1. Users / Auth (`/users`)

### Register User
- **Method**: `POST`
- **Route**: `/users/register`
- **Content-Type**: `multipart/form-data`
- **Body**: `fullName`, `email`, `phone`, `password`, `address`, `PinCode`, `City`, `State`, `role` ("customer" or "farmer"), `farmeractive`, `avatar` (File)

### Login User
- **Method**: `POST`
- **Route**: `/users/login`
- **Body (JSON)**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Expected Response**: `{ "data": { "user": {...}, "accessToken": "...", "refreshToken": "..." } }`

### Google Login
- **Method**: `POST`
- **Route**: `/users/google-login`
- **Body (JSON)**: `{ "email": "...", "fullName": "...", "avatar": "...", "role": "customer" }`

### Logout User
- **Method**: `POST`
- **Route**: `/users/logout`
- **Headers**: `Authorization: Bearer <accessToken>`

### Refresh Token
- **Method**: `POST`
- **Route**: `/users/refresh_token`
- **Body (JSON)**: `{ "refreshToken": "..." }`

### Forget Password
- **Method**: `POST`
- **Route**: `/users/forget-password`
- **Body (JSON)**: `{ "email": "...", "password": "newpassword123" }`

### Change Password
- **Method**: `POST`
- **Route**: `/users/changed-password`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body (JSON)**: `{ "oldPassword": "...", "NewPassword": "..." }`

### Update Account Profile (Switch Role / Details)
- **Method**: `PATCH`
- **Route**: `/users/updated-account`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body (JSON)**: Any fields to update (e.g., to become a farmer: `{ "role": "farmer", "farmeractive": "Active" }`)

### Update Avatar
- **Method**: `PATCH`
- **Route**: `/users/avatar`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Content-Type**: `multipart/form-data`
- **Body**: `avatar` (File)

### Get All Farmers
- **Method**: `GET`
- **Route**: `/users/all-Farmers`

### Delete Farmer Account
- **Method**: `DELETE`
- **Route**: `/users/delete-farmer-account`
- **Headers**: `Authorization: Bearer <accessToken>`

---

## 2. Products (`/product`)

### Get All Products
- **Method**: `GET`
- **Route**: `/product/all-products`

### Get Single Product
- **Method**: `GET`
- **Route**: `/product/product/:productId`

### Add Product (Farmer)
- **Method**: `POST`
- **Route**: `/product/add-product`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Content-Type**: `multipart/form-data`
- **Body**: `name`, `description`, `price`, `stock`, `category`, `unit`, `minOrderQuantity`, `productImages` (Files array)

### Update Product (Farmer)
- **Method**: `POST`
- **Route**: `/product/update`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Content-Type**: `multipart/form-data`
- **Body**: `productId`, `name`, `description`, etc., `productImages` (Files array optional)

### Delete Product (Farmer)
- **Method**: `DELETE`
- **Route**: `/product/farmer/:productId`
- **Headers**: `Authorization: Bearer <accessToken>`

### Get Farmer's Own Products
- **Method**: `POST`
- **Route**: `/product/farmer-all-products`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body (JSON)**: `{ "farmerId": "id" }`

---

## 3. Cart (`/cart`)

### Get Cart
- **Method**: `GET`
- **Route**: `/cart/get`
- **Headers**: `Authorization: Bearer <accessToken>`

### Add to Cart
- **Method**: `POST`
- **Route**: `/cart/add`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body (JSON)**: `{ "productId": "id", "quantity": 1 }`

### Update Cart Quantity
- **Method**: `PATCH`
- **Route**: `/cart/update`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body (JSON)**: `{ "productId": "id", "quantity": 5 }`

---

## 4. Wishlist (`/wishlist`)

### Get Wishlist
- **Method**: `GET`
- **Route**: `/wishlist/get`
- **Headers**: `Authorization: Bearer <accessToken>`

### Add to Wishlist
- **Method**: `POST`
- **Route**: `/wishlist/add`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body (JSON)**: `{ "productId": "id" }`

### Remove from Wishlist
- **Method**: `DELETE`
- **Route**: `/wishlist/remove`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body (JSON)**: `{ "productId": "id" }`

---

## 5. Orders (`/order`)

### Place Cash On Delivery Order
- **Method**: `POST`
- **Route**: `/order/cashondelivery`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body (JSON)**: `orderData` (shipping Address, items, total amount etc.)

### Get Customer's Orders
- **Method**: `GET`
- **Route**: `/order/getuserorders`
- **Headers**: `Authorization: Bearer <accessToken>`

### Get Farmer's Orders
- **Method**: `GET`
- **Route**: `/order/farmerorderlist`
- **Headers**: `Authorization: Bearer <accessToken>`

### Update Order Status (Farmer/Admin)
- **Method**: `PATCH`
- **Route**: `/order/updatestatus`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body (JSON)**: `{ "orderId": "id", "status": "Shipped" }`

### Delete Order Record
- **Method**: `DELETE`
- **Route**: `/order/updateorderrecord`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Body (JSON)**: `{ "orderId": "id" }`

### Get All Orders (Admin)
- **Method**: `GET`
- **Route**: `/order/getorders`
- **Headers**: `Authorization: Bearer <accessToken>`
