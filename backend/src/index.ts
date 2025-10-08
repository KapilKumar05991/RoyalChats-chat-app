import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.router.js';
import connectDB from './config/db.js'
import userRouter from './routes/user.router.js'
import convRouter from './routes/conversation.router.js'
import socketMiddleware from './middlewares/socketMiddleware.js'
import ENV from './lib/env.js'
import { User } from './models/user.js'
import { updateLastSeen } from './controllers/user.controller.js'
dotenv.config({ quiet: true })

const PORT = ENV.PORT

connectDB()
const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: ENV.CLIENT_URL,
        credentials: true
    },
})

app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth', authRoutes)
app.use('/api/users', userRouter)
app.use('/api/conversations', convRouter)
app.get('/api/health', (req, res) => {
    res.send({ ok: true, time: new Date().toUTCString() })
})

const online = new Map<string, string>()

function getOnlineUsers() {
    return Object.fromEntries(online)
}

io.use(socketMiddleware)

export function sendMessageViaSocket(id: string, message: any) {
    const socket_id = online.get(id)
    if (socket_id) {
        io.to(socket_id).emit('chat_message', { message, group: false });
    }
}

export function sendNewGroupInfo(id: string, group: any) {
    const socket_id = online.get(id)
    if (socket_id) {
        io.to(socket_id).emit('new_group', { group });
    }
}
export function sendMessageToGroup(id: string, message: any) {
    io.to(id).emit('chat_message', { message , group: true})
}

io.on('connection', async (socket) => {
    const { _id } = socket.data.user
    online.set(_id.toString(), socket.id)
    io.emit('online_users', Object.keys(getOnlineUsers()))

    socket.on('join_room', (roomId) => {
        socket.join(roomId)
    })

    socket.on('typing', ({ receiver_id }) => {
        const { _id } = socket.data.user
        const receiver_socket = online.get(receiver_id)
        if (receiver_socket) {
            io.to(receiver_socket).emit('typing', _id)
        }
    })

    socket.on('disconnect', async () => {
        const { _id } = socket.data.user
        updateLastSeen(_id)
        online.delete(_id.toString())
        io.emit('online_users', Object.keys(getOnlineUsers()))
    })
})


server.listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT}`)
})