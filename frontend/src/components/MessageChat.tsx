import useAuthStore from "@/store/auth-store"
import type { Message } from "@/store/chat-store"
import { hourMin } from "@/utils/hourMin"
import MessageImage from "./MessageImage"
import MessageMenu from "./MessageMenu"
import { useEffect, useState } from "react"
import useChatStore from "@/store/chat-store"

interface MessageProp {
  message: Message
}

const MessageChat = ({ message }: MessageProp) => {
  const user = useAuthStore(state => state.user)
  const byme = message.sender_id === user._id
  const time = hourMin(message.createdAt)
  const conversation = useChatStore.getState().conversation
  const isGroupChat = conversation.is_group
  const [sender, setSender] = useState('')

  useEffect(() => {
    if (isGroupChat) {
      const member: any = conversation.members.find((member) => ((member.user_id as any)._id === message.sender_id))
      setSender(member.user_id.name)
    }
  }, [])

  return (
    <div className={`${byme ? 'bg-primary self-end' : 'bg-input/40'} max-w-3/4 relative w-fit rounded-md px-3 pr-7 py-2`}>
      {message.attachment.path && <MessageImage public_id={message.attachment.public_id} url={message.attachment.path} />}
      {byme &&
        <MessageMenu id={message._id} />
      }
      <p className="leading-7 break-all">{message.text}</p>
      {isGroupChat &&
        <span className="absolute text-gray-300 left-1 top-0 text-[10px]">{byme ? 'You': sender}</span>
      }
      <span className="absolute text-gray-300 right-1 bottom-0 text-[10px]">{time}</span>
    </div>
  )
}

export default MessageChat