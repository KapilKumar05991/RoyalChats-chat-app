import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Menu } from "./Menu"
import useAuthStore from "@/store/auth-store"
import ImageDialog from "./ImageDialog"
import LeftSidebarTabs from "./LeftSidebarTabs"


function LeftSidebar() {
    const user = useAuthStore(state => state.user)
    const url = user.avatar.path

    return (
        <div className="w-full mx-auto h-screen lg:w-1/3 md:p-4">
            <div className="bg-sidebar h-[95vh] md:h-full p-2 flex flex-col gap-2 rounded-md">
                <h1 className="text-2xl text-center font-semibold text-orange-500">RoyalChats</h1>
                <div className="flex gap-2 p-2">
                    <Avatar className="cursor-pointer size-9">
                        {url && 
                            <ImageDialog url={url}/>
                        }
                        <AvatarImage src={url || '/user.png'} alt="user_avatar" className="rounded-full object-cover" />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="w-full flex justify-between rounded-md">
                        <span>{user.name}</span>
                        <div className="flex gap-2">
                            <Menu />
                        </div>
                    </div>
                </div>
                <LeftSidebarTabs/>
            </div>
        </div>
    )
}

export default LeftSidebar