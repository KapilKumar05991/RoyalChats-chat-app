import LeftSidebar from "@/components/LeftSidebar"
import RightSidebar from "@/components/RightSidebar"
import useMobile from "@/hooks/useMobile"
import useChatStore from "@/store/chat-store"

const Home = () => {
  const  conversationId  = useChatStore(state => state.conversation._id)
  const isMobile = useMobile()

  if (isMobile) {
    return (
      <div className="container mx-auto">
        {conversationId ? <RightSidebar /> : <LeftSidebar />}
      </div>
    )
  }
  return (
    <div className="container mx-auto flex flex-row">
      <LeftSidebar />
      <RightSidebar />
    </div>
  )
}

export default Home