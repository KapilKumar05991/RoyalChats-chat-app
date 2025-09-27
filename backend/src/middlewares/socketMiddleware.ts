import type { Socket } from "socket.io"
import cookie from 'cookie'
import { verifyToken } from "../utils/auth.js"
import { User } from "../models/user.js"

async function socketMiddleware(socket: Socket, next: any) {
    try {
        const cookie_string = socket.handshake.headers.cookie || ''
        const cookies = cookie.parse(cookie_string)
        const token = cookies.token
        if (!token) {
            const err = new Error('auth error: token is required')
            return next(err)
        }
        const payload = verifyToken(token)
        if (!payload) {
            const err = new Error('auth error: invalid token');
            next(err)
        }
        const user = await User.findById((payload as any).id).lean()
        socket.data.user = user;
        next()
    } catch (error) {
        next(error)
    }

}

export default socketMiddleware