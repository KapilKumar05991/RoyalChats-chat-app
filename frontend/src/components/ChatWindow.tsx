import Topbar from "./Topbar"
import Messages from "./Messages"
import InputMessage from "./InputMessage"
import GroupTopbar from "./GroupTopbar"
import useChatStore from "@/store/chat-store"

function ChatWindow() {
    const isGroup = useChatStore(state => state.conversation.is_group)
    return (
        <div className="h-full flex flex-col justify-between">
            { isGroup ? <GroupTopbar/> : <Topbar />}
            <Messages />
            <InputMessage />
        </div>
    )
}

export default ChatWindow