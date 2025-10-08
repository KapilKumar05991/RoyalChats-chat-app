import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useChatStore from "@/store/chat-store";
import { Circle } from "lucide-react";
import ImageDialog from "./ImageDialog";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import type { User } from "@/utils/types";
import useUserStore from "@/store/user-store";
import { hourMin } from "@/utils/hourMin";

interface UserProp {
    user: User
}

function UserBar({ user }: UserProp) {
    const { setReceiver } = useChatStore(state => state)
    const onlineUsers = useUserStore(state => state.onlineUsers)
    const isOnline = onlineUsers.includes(user._id)
    const { cache, missed } = useChatStore(state => state)
    const [info, setInfo] = useState<any>({
        count: 0,
        last_message: {
            text: ''
        }
    })

    useEffect(() => {
        if (cache.hasOwnProperty(user._id)) {
            const data = cache[user._id]
            setInfo({ count: data.count, last_message: data.last_message })
        } else if (missed.hasOwnProperty(user._id)) {
            const data = missed[user._id]
            setInfo(data)
        } else {
            setInfo({
                count: 0,
                last_message: {
                    text: ''
                }
            })
        }
    }, [missed, cache])

    const url = user.avatar.path
    function handleClick() {
        setReceiver(user)
    }

    return (
        <div className="hover:bg-white/10 cursor-pointer flex items-center rounded-md p-2 gap-2">
            <Avatar className="border-2 border-primary z-30 relative size-9">
                {url &&
                    <ImageDialog url={url} />
                }
                {isOnline &&
                    <Circle className="absolute rounded-full top-0 -right-0.5 text-green-600 bg-green-600 size-3" />
                }
                <AvatarImage src={url || '/user.png'} alt="user_avatar" className="rounded-full object-cover" />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div onClick={handleClick} className="flex-1 flex flex-col">
                <span className="line-clamp-1">{user.name}</span>
                {info.count > 0 ?
                    <p className="font-bold text-xs flex justify-between">
                        <span className="line-clamp-1">
                            {info.last_message.text ? info.last_message.text : 'new message'}
                        </span>
                        <span>
                            <Badge className="h-5 mr-2 bg-green-500 font-semibold min-w-5 rounded-full px-1 font-mono tabular-nums">{info.count < 101 ? info.count : '100+'}</Badge>
                            {hourMin(info.last_message.createdAt)}
                        </span>
                    </p> : ''
                }
            </div>
        </div>
    )
}

export default UserBar