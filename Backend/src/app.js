import express from 'express'
import cors from  'cors'



const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true,limit:"10mb"}));
app.use(express.static("Public"));
import userRouter from "./Routes/user.route.js"
import productRouter from "./Routes/Product.route.js"
import cartRouter from "./Routes/Cart.route.js"
import wishlistRouter from './Routes/Wishlist.route.js';
import orderRouter from "./Routes/Order.route.js";
app.use("/api/v1/product",productRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/cart",cartRouter)
app.use("/api/v1/wishlist",wishlistRouter)
app.use("/api/v1/order",orderRouter)

export default app ;