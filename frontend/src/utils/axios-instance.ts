import axios from 'axios'
const api_url = import.meta.env.VITE_API_URL

const instance = axios.create({
    baseURL: api_url,
    withCredentials: true
})

export default instance