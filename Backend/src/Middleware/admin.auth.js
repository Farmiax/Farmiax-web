import jwt from "jsonwebtoken"
import { asyncHandler } from "../Utiles/AscynHandler.js"
import { ApiError } from "../Utiles/ApiError.js"
import { Apiresponse } from "../Utiles/ApiResponse.js"

export const adminAuth=asyncHandler(async(req,res,next)=>{
    const authHeader = req.headers.authorization;
    const token = req.headers.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);
    
    if (!token) {
        return res.status(400).json(new Apiresponse(400, null, "token is not valide"))
        
    }
    const decodetoken= await jwt.verify(token,process.env.ACCES_TOKEN_SECRET)
    
    if (decodetoken.payload !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD) {
        return res.status(400).json(new Apiresponse(400, null, "not autherise , login again"))
        
    }
    next()
    
})


