import { io, type Socket } from "socket.io-client";
import { create } from "zustand";
import useUserStore from "./user-store";
import useChatStore from "./chat-store";
const api_url = import.meta.env.VITE_API_URL


interface SocketStore {
    socket: Socket | null
    connect: () => void
    disconnect: () => void
    subscribeEvents: () => void
    subscribeMessageEvent: () => void
    subscribeOnlineEvent: () => void
    subscribeTypingEvent: () => void
    subscribeNewGroupEvent: () => void
    emmitTyping: () => void
    emmitJoinGroup: (id: string) => void
}

const useSocketStore = create<SocketStore>()((set, get) => ({
    socket: null,

    connect() {
        const socket = get().socket
        if (!socket) {
            const socket = io(api_url, {
                withCredentials: true
            })
            set({ socket })
        }
    },
    disconnect() {
        const socket = get().socket
        if (socket) {
            socket.disconnect()
        }
    },
    subscribeEvents() {
        get().subscribeMessageEvent()
        get().subscribeNewGroupEvent()
        get().subscribeOnlineEvent()
        get().subscribeTypingEvent()
    },
    subscribeMessageEvent() {
        const socket = get().socket
        socket?.on('chat_message', ({ message,group }) => {
            useChatStore.getState().setMessage(message,group)
        })
    },
    subscribeOnlineEvent() {
        const socket = get().socket
        socket?.on('online_users', (onusers) => {
            useUserStore.getState().setOnlineUsers(onusers)
            useUserStore.getState().sortContacts()
        })
    },
    subscribeTypingEvent() {
        const socket = get().socket
        socket?.on('typing', (receiver_id) => {
            useChatStore.getState().setReceiverTyping(receiver_id)
        })
    },
    subscribeNewGroupEvent() {
        const socket = get().socket
        socket?.on('new_group',({group}) => {
            useUserStore.getState().setGroup(group)
        })
    },
    emmitTyping() {
        const socket = get().socket
        const receiver = useChatStore.getState().receiver
        if(receiver._id) {
            socket?.emit('typing', { receiver_id: receiver._id })
        }
    },
    emmitJoinGroup(id) {
        const socket = get().socket
        socket?.emit('join_room', id)
    },
}))

export default useSocketStore