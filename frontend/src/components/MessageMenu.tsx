import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useChatStore from "@/store/chat-store"
import { Ellipsis, Trash2 } from "lucide-react"

interface MessageMenuProp {
    id: string
}

function MessageMenu({id}: MessageMenuProp) {
    const deleteMessage = useChatStore(state => state.deleteMessage)
    async function handleDelete() {
        await deleteMessage(id)
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <span className="absolute text-gray-300 right-1 top-0.5"><Ellipsis className="size-4" /></span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-16 mt-7 mr-4" align="start">
                <DropdownMenuLabel className="text-sm">Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <span onClick={handleDelete} className="flex w-full items-center justify-between">
                            <span>Delete</span> <Trash2 />
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default MessageMenu