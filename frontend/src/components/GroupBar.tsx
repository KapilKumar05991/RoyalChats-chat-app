import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import type { Conversation } from "@/utils/types";
import useChatStore from "@/store/chat-store";
import { useEffect, useState } from "react";
import { hourMin } from "@/utils/hourMin";

interface GroupProp {
    group: Conversation
}

function GroupBar({ group }: GroupProp) {
    const {setGroup, cache, missed } = useChatStore(state => state)
    const [info, setInfo] = useState<any>({
        count: 0,
        last_message: {
            text: ''
        }
    })
    useEffect(() => {
        if (cache.hasOwnProperty(group._id)) {
            const data = cache[group._id]
            setInfo({ count: data.count, last_message: data.last_message })
        } else if (missed.hasOwnProperty(group._id)) {
            const data = missed[group._id]
            setInfo(data)
        } else {
            setInfo({
                count: 0,
                last_message: {
                    text: ''
                }
            })
        }
    }, [cache,missed])

    function handleClick() {
        setGroup(group)
    }
    return (
        <div className="hover:bg-white/10 cursor-pointer flex items-center rounded-md p-2 gap-2">
            <Avatar className="border-2 border-primary z-30 relative size-9">
                <AvatarImage src={'/user.png'} alt="group_avatar" className="rounded-full object-cover" />
                <AvatarFallback>{group.name[0]}</AvatarFallback>
            </Avatar>
            <div onClick={handleClick} className="flex-1 flex flex-col">
                <span className="line-clamp-1">{group.name}</span>
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

export default GroupBar