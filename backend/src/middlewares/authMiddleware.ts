import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/auth.js";
import { User } from "../models/user.js";
import { StatusCodes } from "http-status-codes";

async function authMiddleware(req: Request,res: Response,next: NextFunction) {
    try {
        const token = req.cookies.token
        if(!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Unauthorized'
            })
        }
        const decode = verifyToken(token)
        if(!decode) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Unauthorized Invalid token'
            })
        }
        const userId = (decode as any).id
        const user = await User.findById(userId).select('-password').lean()
        if(!user) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: 'Unauthorized User Not Found'
            })
        }
        // @ts-ignore
        req.user = user
        next()
    } catch (error) {
        next(error)   
    }
}

export default authMiddleware