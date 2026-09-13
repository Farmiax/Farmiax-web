import jwt from "jsonwebtoken"
import { asyncHandler } from "../Utiles/AscynHandler.js"
import { ApiError } from "../Utiles/ApiError.js"
import { Apiresponse } from "../Utiles/ApiResponse.js"

export const adminAuth = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = req.headers.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);
        
        if (!token) {
            return res.status(401).json(new Apiresponse(401, null, "Admin token missing"));
        }

        const decodetoken = jwt.verify(token, process.env.ACCES_TOKEN_SECRET);
        
        const expectedPayload = ((process.env.ADMIN_EMAIL || "") + (process.env.ADMIN_PASSWORD || "")).trim().toLowerCase();
        const actualPayload = String(decodetoken?.payload || "").trim().toLowerCase();

        if (!decodetoken || !actualPayload || actualPayload !== expectedPayload) {
            return res.status(401).json(new Apiresponse(401, null, "Admin session expired or unauthorized. Please log in again."));
        }

        next();
    } catch (error) {
        return res.status(401).json(new Apiresponse(401, null, "Admin session expired or invalid. Please log in again."));
    }
});




