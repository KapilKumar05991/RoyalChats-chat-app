import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import useChatStore from "@/store/chat-store"

import { Trash2 } from "lucide-react"

function DeleteDialog() {
    const deleteAllMessages = useChatStore(state => state.deleteAllMessages)
    async function handleDelete() {
        await deleteAllMessages()
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Trash2 className="cursor-pointer mt-0.5 size-5" />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        all your messages and remove messages data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


export default DeleteDialog