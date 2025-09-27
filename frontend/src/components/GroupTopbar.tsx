import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { X } from "lucide-react"
import DeleteGroupDialog from "./DeleteGroupDialog"
import useAuthStore from "@/store/auth-store"
import DeleteDialog from "./DeleteDialog"
import useChatStore from "@/store/chat-store"

const GroupTopbar = () => {
    const { conversation, removeChat } = useChatStore(state => state)
    const user = useAuthStore.getState().user
    const member = conversation.members.find((member) => ((member.user_id as any)._id === user._id))
    const isAdmin = member?.role == 'admin'
    const members = conversation.members.map((member) => (member.user_id as any).name)
    return (
        <div className="bg-white/10 z-40 w-full overflow-auto flex items-center p-2 md:rounded-t-md gap-4">
            <Avatar className="cursor-pointer size-9">
                <AvatarImage src={'/user.png'} alt="user_avatar" className="rounded-full object-cover" />
                <AvatarFallback>{conversation.name}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span>{conversation.name}</span>
                <p className="max-w-full text-sm transition-all hover:line-clamp-none line-clamp-1 text-gray-400">
                    {members.join(', ')}
                </p>
            </div>
            <div className="ml-auto text-orange-500 flex gap-1">
                {isAdmin ? <DeleteGroupDialog /> : <DeleteDialog />}
                <button onClick={removeChat} className="cursor-pointer">
                    <X />
                </button>
            </div>
        </div>
    )
}

export default GroupTopbar