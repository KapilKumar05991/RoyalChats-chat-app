import { create } from 'zustand'
import axios from '../utils/axios-instance'
import { toast } from 'sonner';
import type { User } from '@/utils/types'
import useSocketStore from './socket-store';
import useUserStore from './user-store';
import useChatStore from './chat-store';


interface AuthStore {
  user: User
  isLoggedIn: boolean
  loading: boolean

  setUser: (user: User) => void
  authenticate: () => void
  register: (data: any) => Promise<void>
  login: (data: any) => Promise<void>
  logout: () => Promise<void>
}

const useAuthStore = create<AuthStore>()((set, get) => ({
  user: {
    _id: '',
    name: '',
    email: '',
    avatar: {
      path: '',
      public_id: ''
    }
  },
  isLoggedIn: false,
  loading: true,

  async authenticate() {
    try {
      set({ loading: true })
      const res = await axios.get('/api/auth/me');
      const user = res.data.user
      set({ user, isLoggedIn: true, loading: false })

      useUserStore.getState().initStore()
      useSocketStore.getState().connect()
      useSocketStore.getState().subscribeEvents()
      useChatStore.getState().fetchMissedMessage()
    } catch (error) {
      set({ loading: false })
    }
  },
  async register(data) {
    try {
      await axios.post('/api/auth/register', data)
      toast('Registered successfully')
      get().authenticate()
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  },
  async login(data) {
    try {
      await axios.post('/api/auth/login', data)
      toast('Login successfully')
      get().authenticate()
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  },
  async logout() {
    try {
      const res = await axios.post('/api/auth/logout')
      useUserStore.getState().resetStore()
      useChatStore.getState().resetStore()
      const initialState = useAuthStore.getInitialState()
      set({...initialState})
      set({ loading: false })
      console.log(get())
      toast(res.data.message)
    } catch (error: any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  },
  setUser(user) {
    set({ user })
  },
}))

export default useAuthStore