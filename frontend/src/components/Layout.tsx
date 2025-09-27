import { useEffect } from "react"
import { Outlet,  } from 'react-router-dom'
import { Toaster } from "./ui/sonner";
import useAuthStore from "@/store/auth-store";
import useSocketStore from "@/store/socket-store";


const Layout = () => {
    const isLoggedIn = useAuthStore(state => state.isLoggedIn)    
    const disconnect = useSocketStore(state => state.disconnect)
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.add('dark');
        if(!isLoggedIn) {
            disconnect()
        }
    }, [isLoggedIn]);
    
    return (
        <div>
            <Outlet />
            <Toaster position="top-center"/>
        </div>
    )
}

export default Layout