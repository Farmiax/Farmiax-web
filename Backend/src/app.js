import express from 'express'
import cors from  'cors'
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

const app = express()
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'x-requested-with']
}));

// Security Headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({extended:true,limit:"10mb"}));

// Data Sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data Sanitization against XSS
// app.use(xss());

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

// Catch-all route to serve React app for non-API requests (fixes refresh 404 issue)
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'Public', 'index.html'));
});

export default app ;