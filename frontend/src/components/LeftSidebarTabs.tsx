import UserSkeleton from "./UserSkeleton"
import { useEffect, useState, } from "react"
import useDebounce from "@/hooks/useDebounce"
import axios from '../utils/axios-instance'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import UserBar from "./UserBar"
import { Search } from "lucide-react"
import CreateGroupDialog from "./CreateGroupDialog"
import GroupBar from "./GroupBar"
import useUserStore from "@/store/user-store"

function LeftSidebarTabs() {
    const [input, setInput] = useState('')
    const value = useDebounce(input, 500)
    const filter = value.trim()
    const { contacts,groups, loading } = useUserStore(state => state)
    const [fUsers, setFUsers] = useState(contacts)

    const [groupFilter, setGroupFilter] = useState('')
    const [fGroups, setFGroups] = useState(groups)


    useEffect(() => {
        if (filter) {
            const users = contacts.filter((contact) => (contact.name.toLowerCase().startsWith(filter.toLowerCase())))
            setFUsers(users)
        }
    }, [value])

    useEffect(() => {
        const fitered = groups.filter((group) => (group.name.toLowerCase().startsWith(groupFilter.toLowerCase())))
        setFGroups(fitered)
    },[groupFilter])

    async function handleClick() {
        if (filter) {
            const res = await axios.get(`/api/users?filter=${filter}`)
            setFUsers(res.data.users)
        }
    }

    return (
        <div className="flex w-full flex-col gap-6">
            <Tabs defaultValue="contacts">
                <TabsList className="w-full px-2 space-x-4">
                    <TabsTrigger value="contacts">Contacts</TabsTrigger>
                    <TabsTrigger value="groups">Groups</TabsTrigger>
                </TabsList>
                <TabsContent value="contacts">
                    <div className="flex text-lg gap-2 p-2">
                        <Input className="py-5" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search Name" />
                        <Button className="py-5" onClick={handleClick}><Search className="size-4" /></Button>
                    </div>
                    {/* Map Users */}
                    <div className="flex flex-col md:p-2 overflow-auto">
                        {(filter && fUsers.length == 0) && <h2 className="text-center">Person '{filter}' not found in your contacts. click on <Search className="inline size-4" /> <br/> Or <br/> Not found globally</h2>}
                        {loading ?
                            <UserSkeleton /> :
                            (filter ? fUsers : contacts).map((member) => (
                                <UserBar key={member._id} user={member} />
                            ))
                        }
                    </div>
                </TabsContent>
                <TabsContent value="groups">
                    <div className="flex text-lg gap-2 p-2">
                        <Input className="py-5" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} placeholder="Search Group" />
                        <CreateGroupDialog />
                    </div>
                    {/* Map Groups */}
                    <div className="flex flex-col md:p-2 overflow-auto">
                        {(groupFilter && fGroups.length == 0) && <h2 className="text-center">Group not found with name '{groupFilter}'</h2>}
                        {loading ?
                            <UserSkeleton /> :
                            (groupFilter ? fGroups : groups).map((group) => (
                                <GroupBar key={group._id} group={group} />
                            ))
                        }
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default LeftSidebarTabs