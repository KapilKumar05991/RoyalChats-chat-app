import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoaderPinwheel, Users } from "lucide-react"
import { useState } from "react"
import { Checkbox } from "./ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { toast } from "sonner"
import useUserStore from "@/store/user-store"

function CreateGroupDialog() {
    const [name, setName] = useState("")
    const [members, setMembers] = useState<string[]>([])
    const {contacts} = useUserStore(state => state)
    const {createGroup, loading } = useUserStore(state => state)

    const toggleMember = (id: string) => {
        setMembers((prev) =>
            prev.includes(id) ? prev.filter((m_id) => m_id !== id) : [...prev, id]
        )
    }
    const handleCreate = async () => {
        if(!name || members.length < 1) {
            toast.error('Group Name Or Members are missing')
            return
        }
        await createGroup({name, members})
        setName(''); setMembers([])
    }
    return (
        <Dialog onOpenChange={() => {setName(''); setMembers([])}}>
            <form>
                <DialogTrigger asChild>
                    <Button className="py-5"><Users className="size-4" />Create</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Group</DialogTitle>
                        <DialogDescription>
                            Create a group chat with relevant name and add friends or members.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="group_name">Name</Label>
                            <Input id="group_name" required onChange={(e) => setName(e.target.value)} value={name} name="name" placeholder="Ex: The Boys" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="memberes">Add Members</Label>
                            <div className="mt-2 border-2 rounded-md max-h-60 overflow-y-auto space-y-2">
                                {contacts.map((c) => (
                                    <div
                                        key={c._id}
                                        className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                                        onClick={() => toggleMember(c._id)}
                                    >
                                        <Checkbox checked={members.includes(c._id)} />
                                        <Avatar className="size-9">
                                            <AvatarImage className="object-cover" src={c.avatar.path || c.name} />
                                            <AvatarFallback>{c.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <span>{c.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button disabled={loading} onClick={handleCreate} type="submit">{loading && <LoaderPinwheel className="animate-spin"/>}Create</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default CreateGroupDialog