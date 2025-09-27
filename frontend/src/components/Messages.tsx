import useChatStore from "@/store/chat-store"
import MessageChat from "./MessageChat"
import MessageSkeleton from "./MessageSkeleton"
import { useEffect, useRef } from "react"

const Messages = () => {
  const { messages, loading } = useChatStore(state => state)
  const containerRef = useRef(null)
  useEffect(() => {
    const container:any = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages.length])
  return (
    <div ref={containerRef} className="flex-1 flex scroll-smooth flex-col p-2 gap-2 overflow-auto">
      {loading ?
        <MessageSkeleton /> :
        messages.map((message) => (
          <MessageChat key={message._id} message={message} />
        ))
      }
    </div>
  )
}

export default Messages