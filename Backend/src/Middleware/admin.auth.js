import jwt from "jsonwebtoken"
import { asyncHandler } from "../Utiles/AscynHandler.js"
import { ApiError } from "../Utiles/ApiError.js"
import { Apiresponse } from "../Utiles/ApiResponse.js"

export const adminAuth = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = req.headers.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);
        
        if (!token) {
            return res.status(400).json(new Apiresponse(400, null, "Token is missing or invalid"));
        }

        const decodetoken = jwt.verify(token, process.env.ACCES_TOKEN_SECRET);
        
        if (!decodetoken || decodetoken.payload !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(401).json(new Apiresponse(401, null, "Not authorized, please login again"));
        }

        next();
    } catch (error) {
        return res.status(401).json(new Apiresponse(401, null, error?.message || "Invalid token"));
    }
});



