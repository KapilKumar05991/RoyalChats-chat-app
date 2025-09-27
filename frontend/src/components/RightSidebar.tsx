import Placeholder from "./Placeholder"
import ChatWindow from "./ChatWindow"
import useChatStore from "@/store/chat-store"

function RightSidebar() {
    const  conversationId  = useChatStore(state => state.conversation._id)
    return (
        <div id='right_sidebar' className="w-full h-screen max-h-screen lg:w-3/4 pl-0 md:p-4 ">
            <div className="bg-sidebar h-full relative rounded-md">
                {conversationId ? <ChatWindow /> : <Placeholder />}
            </div>
        </div>
    )
}

export default RightSidebar