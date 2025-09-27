import { create } from 'zustand'
import axios from '../utils/axios-instance'
import { toast } from 'sonner'
import useUserStore from './user-store'
import useSocketStore from './socket-store'
import type { Conversation, User } from '@/utils/types'

export interface Message {
    _id: string
    conversation_id: string
    sender_id: string,
    text: string;
    attachment: {
        path: string,
        public_id: string
    },
    createdAt: string
}

interface ChatData {
    count: number
    last_message: Message | null
    messages: Message[]
    conversation: Conversation
}

interface ChatStore {
    loading: boolean
    receiver: User,
    receiver_typing: boolean
    conversation: Conversation
    messages: Message[]
    cache: {
        [key: string]: ChatData
    }
    missed: {
        [key: string]: Pick<ChatData, 'count' | 'last_message'>
    }
    setReceiverTyping: (id: string) => void
    setMessage: (message: Message) => void
    fetchMissedMessage: () => void
    setReceiver: (receiever: User) => void
    setGroup: (conversation: Conversation) => void
    deleteChat: () => void
    removeChat: () => void
    getConversation: () => Promise<void>
    sendMessage: (data: any) => Promise<void>
    deleteMessage: (message_id: string) => Promise<void>
    deleteAllMessages: () => Promise<void>
    saveInCache: () => void
    removeMissed: (id: string) => void
    resetStore: () => void
}



const useChatStore = create<ChatStore>()((set, get) => ({
    loading: false,
    receiver: {
        _id: '',
        name: '',
        email: '',
        avatar: {
            path: '',
            public_id: ''
        },
    },
    receiver_typing: false,
    conversation: {
        _id: '',
        name: '',
        is_group: false,
        members: [{ user_id: 'null', role: 'admin' }],
    },
    messages: [],
    cache: {},
    missed: {},
    async fetchMissedMessage() {
        try {
            const res = await axios.get('api/users/messages/missed')
            set({ missed: res.data.missed_messages })
        } catch (error) {
            console.log(error)
        }
    },
    setReceiverTyping(id) {
        let clock;
        if (id === get().receiver._id) {
            set({ receiver_typing: true })
            clearTimeout(clock)
            clock = setTimeout(() => {
                set({ receiver_typing: false })
            }, 800)
        }
    },
    setMessage(message) {
        const conversation = get().conversation
        if (message.conversation_id === conversation._id) {
            set({ messages: [...get().messages, message] })
        } else {
            const cache = get().cache
            if (cache.hasOwnProperty(message.conversation_id)) {
                const data = cache[message.conversation_id]
                data.count = data.count + 1;
                data.last_message = message;
                data.messages.push(message)
                set({ cache: { ...cache } })
            } else if (cache.hasOwnProperty(message.sender_id)) {
                const data = cache[message.sender_id]
                data.count = data.count + 1;
                data.last_message = message;
                data.messages.push(message)
                set({ cache: { ...cache } })
            } else {
                const missed = get().missed
                missed[message.sender_id] = { count: 1, last_message: message }
                set({ missed: { ...missed } })
            }
        }
    },
    async sendMessage(data) {
        try {
            const res = await axios.post('/api/conversations/messages/send', data, {
                headers: { "Content-Type": "multipart/form-data", },
            })
            const isGroup = get().conversation.is_group
            if (!isGroup) {
                const msg = res.data.msg
                const messages = get().messages
                messages.push(msg)
                set({ messages })
            }
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    },
    setReceiver: (receiver) => {
        get().saveInCache()
        set({ receiver })

        const id = receiver._id
        get().removeMissed(id)
        const cache = get().cache
        const data = cache[id]
        if (data) {
            set({ conversation: data.conversation, messages: data.messages })
            delete cache[id]
            set({ cache: { ...cache } })
        } else {
            const contacts = useUserStore.getState().contacts
            const receiverIdx = contacts.findIndex((user) => user._id === id)
            if (receiverIdx < 0) {
                useUserStore.getState().setContact(receiver)
            }
            get().getConversation()
        }
    },
    removeChat() {
        get().saveInCache()
        const initialState = useChatStore.getInitialState()
        set({ receiver: initialState.receiver, conversation: initialState.conversation, messages: initialState.messages })
    },

    setGroup: async (conversation) => {
        get().saveInCache()
        const cache = get().cache
        const data = cache[conversation._id]
        if (data) {
            const initalReceiver = useChatStore.getInitialState().receiver
            set({ receiver: initalReceiver, conversation: data.conversation, messages: data.messages })
            delete cache[conversation._id]
            set({cache: {...cache}})
        } else {
            const res = await axios.get(`/api/conversations/messages/${conversation._id}`)
            const messages = res.data.messages
            const initalReceiver = useChatStore.getInitialState().receiver
            set({ receiver: initalReceiver, conversation: conversation, messages: messages, loading: false })
            useSocketStore.getState().emmitJoinGroup(conversation._id)
        }
    },

    async deleteChat() {
        try {
            const conversation = get().conversation
            const res = await axios.delete(`/api/conversations/${conversation._id}`)
            get().resetStore()
            useUserStore.getState().fetchGroups()
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    },
    getConversation: async () => {
        try {
            set({ loading: true })
            let res = await axios.get(`/api/conversations/${get().receiver._id}`)
            const conversation = res.data.conversation
            res = await axios.get(`/api/conversations/messages/${conversation._id}`)
            const messages = res.data.messages
            set({ conversation: conversation, messages: messages, loading: false })
        } catch (error) {
            set({ loading: false })
        }
    },

    deleteMessage: async (message_id) => {
        try {
            const res = await axios.delete(`/api/conversations/messages/${message_id}`)
            const messages = get().messages
            const idx = messages.findIndex((message) => message._id == message_id)
            messages.splice(idx, 1)
            set({ messages: messages })
            toast(res.data.message)
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    },
    deleteAllMessages: async () => {
        try {
            const conversation = get().conversation
            let res = await axios.delete(`/api/conversations/messages/all/${conversation._id}`)
            toast(res.data.message)

            res = await axios.get(`/api/conversations/messages/${conversation._id}`)
            const messages = res.data.messages
            set({ messages: messages })
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    },


    saveInCache() {
        const receiever = get().receiver
        const conversation = get().conversation
        const cache = get().cache
        if (receiever._id) {
            const messages = get().messages
            cache[receiever._id] = { conversation, messages, last_message: null, count: 0 }
            set({ cache: { ...cache } })
        } else {
            if (conversation._id) {
                const messages = get().messages
                cache[conversation._id] = { conversation, messages, last_message: null, count: 0 }
                set({ cache: { ...cache } })
            }
        }
    },
    removeMissed(id) {
        const missed = get().missed
        delete missed[id]
        delete missed[id]
        set({ missed: { ...missed } })
    },
    resetStore() {
        const initialState = useChatStore.getInitialState()
        set({ ...initialState })
    },
}))

export default useChatStore