import { create } from "zustand";
import axios from "../utils/axios-instance";
import type { Conversation, User } from "@/utils/types";
import useAuthStore from "./auth-store";
import { toast } from "sonner";

interface UserStore {
    loading: boolean
    contacts: User[]
    groups: Conversation[]
    onlineUsers: string[]

    initStore: () => void
    resetStore: () => void
    fetchContacts: () => void
    fetchGroups: () => void
    setContact: (contact: User) => void
    createGroup: (data: any) => void
    sortContacts: () => void
    setOnlineUsers: (ids: string[]) => void
    updateProfile: (data: FormData) => void
}

const useUserStore = create<UserStore>()((set, get) => ({
    loading: false,
    contacts: [],
    groups: [],
    onlineUsers: [],

    initStore() {
        get().fetchContacts()
        get().fetchGroups()
    },
    resetStore() {
        const initialState = useUserStore.getInitialState()
        set({...initialState})
    },
    async fetchContacts() {
        try {
            set({ loading: true })
            const res = await axios.get('/api/users/contacts')
            set({ contacts: res.data.contacts, loading: false })
        } catch (error) {
            set({ loading: false })
        }
    },
    async fetchGroups() {
        try {
            set({ loading: true })
            const res = await axios.get('/api/users/groups')
            set({ groups: res.data.groups })
            set({ loading: false })
        } catch (error: any) {
            set({ loading: false })
        }
    },
    setContact(contact) {
        const contacts = get().contacts
        contacts.push(contact)
        set({ contacts })
        get().sortContacts()
    },

    async createGroup(data) {
        try {
            const res = await axios.post('/api/conversations', data)
            const group = res.data.group
            set({ groups: [... get().groups,group] })
            toast.success(res.data.message)
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    },
    sortContacts() {
        const users = get().contacts
        const onlineUsers = get().onlineUsers
        const contacts = users.sort((user1: User, user2: User) => {
            const indx1 = onlineUsers.findIndex((id) => id === user2._id)
            const indx2 = onlineUsers.findIndex((id) => id === user1._id)
            return indx1 - indx2
        })
        set({ contacts: contacts })
    },
    setOnlineUsers(ids) {
        set({ onlineUsers: ids })
    },
    async updateProfile(data) {
        try {
            set({ loading: true })
            const res = await axios.patch('/api/users/update', data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            const user = res.data.user
            useAuthStore.getState().setUser(user)

            set({ loading: false })
            toast(res.data.message)
        } catch (error: any) {
            set({ loading: false })
            toast.error(error.response.data.message)
        }
    },
}))

export default useUserStore