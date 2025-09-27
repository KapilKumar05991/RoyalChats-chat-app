import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { X } from "lucide-react"
import ImageDialog from "./ImageDialog"
import DeleteDialog from "./DeleteDialog"
import useChatStore from "@/store/chat-store"
import useUserStore from "@/store/user-store"

const Topbar = () => {
    const { receiver, receiver_typing, removeChat } = useChatStore(state => state)
    const onlineUsers = useUserStore(state => state.onlineUsers)
    const isOnline = onlineUsers.includes(receiver._id)
    const isTyping = receiver_typing
    const url = receiver.avatar.path
    return (
        <div className="bg-white/10 z-40 backdrop-blur-3xl w-full flex items-center p-2 md:rounded-t-md gap-4">
            <Avatar className="cursor-pointer size-9">
                {url &&
                    <ImageDialog url={url} />
                }
                <AvatarImage src={url || 'user.png'} alt="user_avatar" className="rounded-full object-cover" />
                <AvatarFallback>{receiver.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span>{receiver.name}</span>
                <span className="text-sm text-gray-400">{isOnline ? isTyping ? 'Typing...' : 'Online' : 'Offline'}</span>
            </div>
            <div className="ml-auto text-orange-500 flex gap-1">
                <DeleteDialog />
                <button onClick={removeChat} className="cursor-pointer">
                    <X />
                </button>
            </div>
        </div>
    )
}

export default Topbar